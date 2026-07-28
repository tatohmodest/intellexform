'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  Maximize,
  Mic,
  MicOff,
  Minimize,
  MonitorUp,
  PhoneOff,
  ScreenShare,
  Users,
  Video,
  VideoOff,
  AlertTriangle,
} from 'lucide-react';
import type {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  ILocalVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';

type Phase = 'connecting' | 'live' | 'error' | 'left';

interface RemoteTile {
  uid: string | number;
  hasVideo: boolean;
}

/** Visible face tiles in the normal 2-col grid (including you). */
const GRID_VISIBLE = 6;
/** Visible face tiles in the bottom filmstrip while presenting. */
const STRIP_VISIBLE = 8;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

export default function AgoraRoom({
  channel,
  displayName,
  title,
}: {
  channel: string;
  displayName: string;
  title: string;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('connecting');
  const [error, setError] = useState<string>('');
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [remotes, setRemotes] = useState<RemoteTile[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const micTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const camTrackRef = useRef<ICameraVideoTrack | null>(null);
  const screenTrackRef = useRef<ILocalVideoTrack | null>(null);
  const localVideoRef = useRef<HTMLDivElement | null>(null);
  /** Native <video> for presenter local preview (clone of screen track). */
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenPreviewCloneRef = useRef<MediaStreamTrack | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const remoteRefs = useRef<Map<string | number, HTMLDivElement>>(new Map());
  const remoteUsersRef = useRef<Map<string | number, IAgoraRTCRemoteUser>>(new Map());

  const clearLocalScreenPreview = useCallback(() => {
    const video = screenVideoRef.current;
    if (video) {
      video.pause();
      video.srcObject = null;
    }
    if (screenPreviewCloneRef.current) {
      screenPreviewCloneRef.current.stop();
      screenPreviewCloneRef.current = null;
    }
  }, []);

  /**
   * Presenter local preview must NOT use Agora track.play() on the same
   * published screen track - that often goes blank for the sharer while
   * remotes still receive video. Clone the MediaStreamTrack into a native
   * <video> instead.
   */
  const playLocalScreenPreview = useCallback(() => {
    const track = screenTrackRef.current;
    const video = screenVideoRef.current;
    if (!track || !video) return;

    clearLocalScreenPreview();
    try {
      const mediaTrack = track.getMediaStreamTrack();
      const clone = mediaTrack.clone();
      screenPreviewCloneRef.current = clone;
      video.srcObject = new MediaStream([clone]);
      video.muted = true;
      video.playsInline = true;
      void video.play().catch((err) => {
        console.error('Local screen preview play failed:', err);
      });
    } catch (err) {
      console.error('Local screen preview attach failed:', err);
    }
  }, [clearLocalScreenPreview]);

  useEffect(() => {
    if (phase !== 'live') return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    function onFsChange() {
      const el = stageRef.current;
      const active =
        document.fullscreenElement === el ||
        // @ts-expect-error vendor-prefixed APIs
        document.webkitFullscreenElement === el;
      setIsFullscreen(Boolean(active));
    }
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
    };
  }, []);

  const leave = useCallback(async () => {
    const client = clientRef.current;
    clearLocalScreenPreview();
    micTrackRef.current?.close();
    camTrackRef.current?.close();
    screenTrackRef.current?.close();
    if (client) await client.leave().catch(() => {});
    setPhase('left');
  }, [clearLocalScreenPreview]);

  useEffect(() => {
    let cancelled = false;

    async function join() {
      try {
        const res = await fetch('/api/learn/agora-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channel }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data.error === 'agora_not_configured'
              ? 'Live video is not configured yet - add NEXT_PUBLIC_AGORA_APP_ID (and AGORA_APP_CERTIFICATE) to the environment.'
              : 'Could not get access to the video room.',
          );
        }

        const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
        AgoraRTC.setLogLevel(3);
        if (cancelled) return;

        const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        clientRef.current = client;

        client.on('user-published', async (user: IAgoraRTCRemoteUser, mediaType) => {
          await client.subscribe(user, mediaType);
          remoteUsersRef.current.set(user.uid, user);
          if (mediaType === 'audio') user.audioTrack?.play();
          setRemotes((prev) => {
            const others = prev.filter((r) => r.uid !== user.uid);
            return [...others, { uid: user.uid, hasVideo: Boolean(user.videoTrack) }];
          });
          if (mediaType === 'video') {
            setTimeout(() => {
              const el = remoteRefs.current.get(user.uid);
              if (el) user.videoTrack?.play(el, { fit: 'cover' });
            }, 60);
          }
        });
        client.on('user-unpublished', (user: IAgoraRTCRemoteUser, mediaType) => {
          if (mediaType === 'video') {
            setRemotes((prev) =>
              prev.map((r) => (r.uid === user.uid ? { ...r, hasVideo: false } : r)),
            );
          }
        });
        client.on('user-left', (user: IAgoraRTCRemoteUser) => {
          setRemotes((prev) => prev.filter((r) => r.uid !== user.uid));
          remoteRefs.current.delete(user.uid);
          remoteUsersRef.current.delete(user.uid);
        });

        await client.join(data.appId, data.channel, data.token ?? null, data.uid);

        const [micTrack, camTrack] = await Promise.all([
          AgoraRTC.createMicrophoneAudioTrack().catch(() => null),
          AgoraRTC.createCameraVideoTrack().catch(() => null),
        ]);
        if (cancelled) {
          micTrack?.close();
          camTrack?.close();
          await client.leave().catch(() => {});
          return;
        }
        micTrackRef.current = micTrack;
        camTrackRef.current = camTrack;
        setMicOn(Boolean(micTrack));
        setCamOn(Boolean(camTrack));

        const tracks = [micTrack, camTrack].filter(Boolean) as (
          | IMicrophoneAudioTrack
          | ICameraVideoTrack
        )[];
        if (tracks.length) await client.publish(tracks);
        if (camTrack && localVideoRef.current) {
          camTrack.play(localVideoRef.current, { fit: 'cover' });
        }

        setPhase('live');
      } catch (err) {
        console.error('Agora join failed:', err);
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to join the room.');
          setPhase('error');
        }
      }
    }

    join();
    return () => {
      cancelled = true;
      leave();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel]);

  // Attach local screen preview when the presenter <video> mounts / sharing flips on.
  const attachScreenVideo = useCallback(
    (el: HTMLVideoElement | null) => {
      screenVideoRef.current = el;
      if (el && screenTrackRef.current) {
        playLocalScreenPreview();
      }
    },
    [playLocalScreenPreview],
  );

  useEffect(() => {
    if (!sharing) return;
    playLocalScreenPreview();
    if (camTrackRef.current && camOn && localVideoRef.current) {
      try {
        camTrackRef.current.play(localVideoRef.current, { fit: 'cover' });
      } catch {
        /* ignore */
      }
    }
  }, [sharing, camOn, playLocalScreenPreview]);

  async function toggleMic() {
    const track = micTrackRef.current;
    if (!track) return;
    await track.setEnabled(!micOn);
    setMicOn(!micOn);
  }

  async function toggleCam() {
    const track = camTrackRef.current;
    if (!track) return;
    const next = !camOn;
    await track.setEnabled(next);
    setCamOn(next);
    if (next && localVideoRef.current) {
      track.play(localVideoRef.current, { fit: 'cover' });
    }
  }

  async function toggleShare() {
    const client = clientRef.current;
    if (!client) return;
    const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
    if (!sharing) {
      try {
        const screen = await AgoraRTC.createScreenVideoTrack(
          {
            encoderConfig: '1080p_1',
            optimizationMode: 'detail',
          },
          'disable',
        );
        const screenTrack = Array.isArray(screen) ? screen[0] : screen;
        screenTrackRef.current = screenTrack;

        // Publish screen instead of camera to the room, but keep local cam preview.
        if (camTrackRef.current) {
          await client.unpublish(camTrackRef.current);
        }
        await client.publish(screenTrack);
        setSharing(true);

        // Native <video> preview for the presenter (students already get the published track).
        requestAnimationFrame(() => {
          playLocalScreenPreview();
          window.setTimeout(playLocalScreenPreview, 150);
          window.setTimeout(playLocalScreenPreview, 450);
          if (camTrackRef.current && camOn && localVideoRef.current) {
            try {
              camTrackRef.current.play(localVideoRef.current, { fit: 'cover' });
            } catch {
              /* ignore */
            }
          }
        });

        screenTrack.on('track-ended', () => {
          void stopShare();
        });
      } catch {
        /* user cancelled the picker */
      }
    } else {
      await stopShare();
    }
  }

  async function stopShare() {
    const client = clientRef.current;
    const screenTrack = screenTrackRef.current;
    clearLocalScreenPreview();
    if (client && screenTrack) {
      await client.unpublish(screenTrack).catch(() => {});
      screenTrack.stop();
      screenTrack.close();
      screenTrackRef.current = null;
      if (camTrackRef.current) {
        await client.publish(camTrackRef.current).catch(() => {});
        if (localVideoRef.current && camOn) {
          camTrackRef.current.play(localVideoRef.current, { fit: 'cover' });
        }
      }
    }
    setSharing(false);
  }

  async function toggleFullscreen() {
    const el = stageRef.current;
    if (!el) return;
    try {
      const active =
        document.fullscreenElement === el ||
        // @ts-expect-error vendor-prefixed APIs
        document.webkitFullscreenElement === el;
      if (active) {
        if (document.exitFullscreen) await document.exitFullscreen();
        // @ts-expect-error vendor-prefixed APIs
        else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
      } else if (el.requestFullscreen) {
        await el.requestFullscreen();
        // @ts-expect-error vendor-prefixed APIs
      } else if (el.webkitRequestFullscreen) {
        // @ts-expect-error vendor-prefixed APIs
        await el.webkitRequestFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen failed:', err);
    }
  }

  async function handleLeave() {
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
    }
    await leave();
    router.push('/dashboard/mentorship');
  }

  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const secs = String(elapsed % 60).padStart(2, '0');

  const faceBudget = sharing ? STRIP_VISIBLE : GRID_VISIBLE;
  // Slots: 1 for you + remotes. Reserve one slot for "+N" when overflowing.
  const totalFaces = 1 + remotes.length;
  const needsOverflow = totalFaces > faceBudget;
  const remoteSlots = needsOverflow ? faceBudget - 2 : faceBudget - 1; // -1 for you, -1 more for +N
  const visibleRemotes = remotes.slice(0, Math.max(0, remoteSlots));
  const hiddenCount = Math.max(0, remotes.length - visibleRemotes.length);

  const gridCols = useMemo(() => {
    if (sharing) return undefined;
    const shown = 1 + visibleRemotes.length + (hiddenCount > 0 ? 1 : 0);
    if (shown <= 1) return '1fr';
    if (shown === 2) return '1fr 1fr';
    return '1fr 1fr'; // Meet-style 2-column grid
  }, [sharing, visibleRemotes.length, hiddenCount]);

  function bindRemote(uid: string | number, el: HTMLDivElement | null) {
    if (!el) {
      remoteRefs.current.delete(uid);
      return;
    }
    remoteRefs.current.set(uid, el);
    const user = remoteUsersRef.current.get(uid);
    if (user?.videoTrack) {
      user.videoTrack.play(el, { fit: 'cover' });
    }
  }

  const localTile = (
    <div
      className="relative overflow-hidden rounded-xl"
      style={{
        background: '#151c23',
        aspectRatio: '16 / 9',
        minWidth: sharing ? 140 : undefined,
        width: sharing ? 160 : undefined,
        flex: sharing ? '0 0 auto' : undefined,
      }}
    >
      <div
        ref={localVideoRef}
        className="h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
      />
      {(phase === 'connecting' || !camOn) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-white/70">
          {phase === 'connecting' ? (
            <>
              <Loader2 size={22} className="animate-spin" />
              <span className="text-[12px]">Joining…</span>
            </>
          ) : (
            <>
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full text-[16px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #00b369, #1f5fa8)' }}
              >
                {initials(displayName)}
              </span>
              <span className="text-[11px]">Camera off</span>
            </>
          )}
        </div>
      )}
      <span className="absolute bottom-1.5 left-2 rounded bg-black/55 px-1.5 py-0.5 text-[10.5px] font-medium text-white">
        {displayName} (you)
      </span>
      {!micOn && (
        <span className="absolute bottom-1.5 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white">
          <MicOff size={12} />
        </span>
      )}
    </div>
  );

  const remoteTiles = visibleRemotes.map((r) => (
    <div
      key={String(r.uid)}
      className="relative overflow-hidden rounded-xl"
      style={{
        background: '#151c23',
        aspectRatio: '16 / 9',
        minWidth: sharing ? 140 : undefined,
        width: sharing ? 160 : undefined,
        flex: sharing ? '0 0 auto' : undefined,
      }}
    >
      <div
        ref={(el) => bindRemote(r.uid, el)}
        className="h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
      />
      {!r.hasVideo && (
        <div className="absolute inset-0 flex items-center justify-center text-white/60">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full text-white"
            style={{ background: '#37474f' }}
          >
            <Users size={18} />
          </span>
        </div>
      )}
      <span className="absolute bottom-1.5 left-2 rounded bg-black/55 px-1.5 py-0.5 text-[10.5px] font-medium text-white">
        Participant {String(r.uid).slice(-4)}
      </span>
    </div>
  ));

  const overflowTile =
    hiddenCount > 0 ? (
      <div
        className="relative flex items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/20"
        style={{
          background: '#1a222b',
          aspectRatio: '16 / 9',
          minWidth: sharing ? 140 : undefined,
          width: sharing ? 160 : undefined,
          flex: sharing ? '0 0 auto' : undefined,
          color: 'rgba(255,255,255,0.85)',
        }}
        title={`${hiddenCount} more participant${hiddenCount === 1 ? '' : 's'}`}
      >
        <div className="text-center">
          <div className="font-display text-[28px] leading-none">+{hiddenCount}</div>
          <div className="mt-1 text-[11px] text-white/55">others</div>
        </div>
      </div>
    ) : null;

  if (phase === 'error') {
    return (
      <div
        className="mx-auto flex max-w-[560px] flex-col items-center rounded-3xl border p-10 text-center"
        style={{ borderColor: 'var(--line)' }}
      >
        <span
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: 'rgba(196,98,42,0.1)', color: '#a14d18' }}
        >
          <AlertTriangle size={26} />
        </span>
        <h2 className="font-display text-[22px]">Couldn&apos;t join the room</h2>
        <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          {error}
        </p>
        <button onClick={() => router.push('/dashboard/mentorship')} className="btn btn-ghost mt-6 !py-2.5 text-[13.5px]">
          Back to mentorship
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-[22px] leading-tight">{title}</h1>
          <div className="flex items-center gap-3 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: phase === 'live' ? '#e5484d' : 'var(--line)' }}
              />
              {phase === 'live' ? 'LIVE' : 'Connecting…'}
            </span>
            <span className="mono">
              {mins}:{secs}
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} /> {remotes.length + 1} in room
            </span>
            {sharing ? (
              <span className="flex items-center gap-1 font-semibold" style={{ color: 'var(--green-deep)' }}>
                <MonitorUp size={12} /> Sharing screen
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold"
            style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
            title={isFullscreen ? 'Exit fullscreen' : 'Go fullscreen'}
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </button>
          <span
            className="mono rounded-full border px-3 py-1 text-[11px]"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
          >
            room: {channel}
          </span>
        </div>
      </div>

      <div
        ref={stageRef}
        className="flex flex-col rounded-3xl p-3"
        style={{
          background: '#0C1116',
          minHeight: isFullscreen ? '100vh' : undefined,
        }}
      >
        {sharing ? (
          /* Meet-style presenting: big screen on top, faces in a strip underneath */
          <div className="flex flex-col gap-3">
            <div
              className="relative w-full overflow-hidden rounded-2xl"
              style={{
                background: '#0a0e12',
                height: isFullscreen ? 'calc(100vh - 220px)' : 420,
              }}
            >
              {/* Native video + cloned track so the presenter sees what students see */}
              <video
                ref={attachScreenVideo}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 h-full w-full bg-black object-contain"
              />
              <span className="pointer-events-none absolute bottom-2.5 left-3 z-10 rounded-md bg-black/55 px-2 py-1 text-[11.5px] font-medium text-white">
                Your screen · sharing
              </span>
              <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-md bg-[var(--green)] px-2 py-1 text-[11px] font-semibold text-white">
                You are presenting
              </span>
              <p className="pointer-events-none absolute bottom-2.5 right-3 z-10 max-w-[220px] text-right text-[10.5px] text-white/55">
                Tip: share a Window or Tab for a clearer preview than Entire Screen
              </p>
            </div>

            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {localTile}
              {remoteTiles}
              {overflowTile}
              {remotes.length === 0 && phase === 'live' ? (
                <div
                  className="flex items-center justify-center rounded-xl border border-dashed border-white/15 px-4 text-[12px] text-white/45"
                  style={{ minWidth: 160, aspectRatio: '16 / 9' }}
                >
                  Waiting for others…
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          /* Normal call: 2-column Meet-style grid + overflow tile */
          <div
            className="grid flex-1 gap-3"
            style={{
              gridTemplateColumns: gridCols,
              alignContent: 'center',
            }}
          >
            {localTile}
            {remoteTiles}
            {overflowTile}
            {remotes.length === 0 && phase === 'live' ? (
              <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 text-white/50">
                <Users size={26} />
                <span className="text-[13.5px]">Waiting for others to join…</span>
                <span className="text-[12px] text-white/35">
                  Share this session link only with Intellex members.
                </span>
              </div>
            ) : null}
          </div>
        )}

        <div
          className="mt-4 flex flex-wrap items-center justify-center gap-3"
          style={isFullscreen ? { paddingBottom: 12 } : undefined}
        >
          <button
            type="button"
            onClick={toggleMic}
            className="flex h-12 w-12 items-center justify-center rounded-full border transition-colors"
            style={
              micOn
                ? {
                    borderColor: 'rgba(255,255,255,0.18)',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                  }
                : { borderColor: 'transparent', background: '#e5484d', color: '#fff' }
            }
            title={micOn ? 'Mute microphone' : 'Unmute microphone'}
          >
            {micOn ? <Mic size={18} /> : <MicOff size={18} />}
          </button>
          <button
            type="button"
            onClick={toggleCam}
            className="flex h-12 w-12 items-center justify-center rounded-full border transition-colors"
            style={
              camOn
                ? {
                    borderColor: 'rgba(255,255,255,0.18)',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                  }
                : { borderColor: 'transparent', background: '#e5484d', color: '#fff' }
            }
            title={camOn ? 'Turn camera off' : 'Turn camera on'}
          >
            {camOn ? <Video size={18} /> : <VideoOff size={18} />}
          </button>
          <button
            type="button"
            onClick={toggleShare}
            className="flex h-12 w-12 items-center justify-center rounded-full border transition-colors"
            style={
              sharing
                ? { borderColor: 'transparent', background: 'var(--green)', color: '#fff' }
                : {
                    borderColor: 'rgba(255,255,255,0.18)',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                  }
            }
            title={sharing ? 'Stop sharing' : 'Share your screen'}
          >
            {sharing ? <MonitorUp size={18} /> : <ScreenShare size={18} />}
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex h-12 w-12 items-center justify-center rounded-full border transition-colors"
            style={{
              borderColor: 'rgba(255,255,255,0.18)',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
            }}
            title={isFullscreen ? 'Exit fullscreen' : 'Go fullscreen'}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
          <button
            type="button"
            onClick={handleLeave}
            className="btn !px-7 !py-3 text-[14px] text-white"
            style={{ background: '#e5484d' }}
          >
            <PhoneOff size={16} /> Leave
          </button>
        </div>
      </div>
    </div>
  );
}
