'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
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
  LayoutGrid,
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

/** Who fills the large Meet-style stage. null = equal grid. */
type Spotlight =
  | { kind: 'local' }
  | { kind: 'screen' }
  | { kind: 'remote'; uid: string | number }
  | null;

const STRIP_VISIBLE = 8;
const GRID_VISIBLE = 6;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

function sameSpotlight(a: Spotlight, b: Spotlight): boolean {
  if (!a || !b) return a === b;
  if (a.kind !== b.kind) return false;
  if (a.kind === 'remote' && b.kind === 'remote') return String(a.uid) === String(b.uid);
  return true;
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
  const [spotlight, setSpotlight] = useState<Spotlight>(null);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const micTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const camTrackRef = useRef<ICameraVideoTrack | null>(null);
  const screenTrackRef = useRef<ILocalVideoTrack | null>(null);
  const localVideoRef = useRef<HTMLDivElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenPreviewCloneRef = useRef<MediaStreamTrack | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const remoteRefs = useRef<Map<string | number, HTMLDivElement>>(new Map());
  const remoteUsersRef = useRef<Map<string | number, IAgoraRTCRemoteUser>>(new Map());
  const sharingRef = useRef(false);

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

  const playLocalCamera = useCallback(() => {
    if (camTrackRef.current && camOn && localVideoRef.current) {
      try {
        camTrackRef.current.play(localVideoRef.current, { fit: 'cover' });
      } catch {
        /* ignore */
      }
    }
  }, [camOn]);

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
            }, 80);
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
          setSpotlight((prev) =>
            prev?.kind === 'remote' && String(prev.uid) === String(user.uid)
              ? sharingRef.current
                ? { kind: 'screen' }
                : null
              : prev,
          );
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

  const attachScreenVideo = useCallback(
    (el: HTMLVideoElement | null) => {
      screenVideoRef.current = el;
      if (el && screenTrackRef.current) playLocalScreenPreview();
    },
    [playLocalScreenPreview],
  );

  const attachLocalVideo = useCallback(
    (el: HTMLDivElement | null) => {
      localVideoRef.current = el;
      if (el) playLocalCamera();
    },
    [playLocalCamera],
  );

  useEffect(() => {
    if (!sharing) return;
    playLocalScreenPreview();
    playLocalCamera();
  }, [sharing, camOn, playLocalScreenPreview, playLocalCamera, spotlight]);

  /** Click a bubble: enlarge it; click the same one again to restore. */
  function focusTile(next: Spotlight) {
    setSpotlight((prev) => {
      if (sameSpotlight(prev, next)) {
        // Toggle off → default (screen while presenting, else equal grid)
        return sharing ? { kind: 'screen' } : null;
      }
      return next;
    });
  }

  function showAll() {
    setSpotlight(sharing ? { kind: 'screen' } : null);
  }

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
    if (next) playLocalCamera();
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

        if (camTrackRef.current) {
          await client.unpublish(camTrackRef.current);
        }
        await client.publish(screenTrack);
        sharingRef.current = true;
        setSharing(true);
        setSpotlight({ kind: 'screen' });

        requestAnimationFrame(() => {
          playLocalScreenPreview();
          window.setTimeout(playLocalScreenPreview, 150);
          window.setTimeout(playLocalScreenPreview, 450);
          playLocalCamera();
        });

        screenTrack.on('track-ended', () => {
          void stopShare();
        });
      } catch {
        /* user cancelled */
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
        playLocalCamera();
      }
    }
    sharingRef.current = false;
    setSharing(false);
    setSpotlight((prev) => (prev?.kind === 'screen' ? null : prev));
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

  function bindRemote(uid: string | number, el: HTMLDivElement | null, fit: 'cover' | 'contain' = 'cover') {
    if (!el) {
      remoteRefs.current.delete(uid);
      return;
    }
    remoteRefs.current.set(uid, el);
    const user = remoteUsersRef.current.get(uid);
    if (user?.videoTrack) {
      user.videoTrack.play(el, { fit });
    }
  }

  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const secs = String(elapsed % 60).padStart(2, '0');

  // Focused layout whenever something is spotlighted (incl. default screen while sharing).
  const focused = spotlight != null;
  const stripBudget = STRIP_VISIBLE;

  // Filmstrip: everyone except the spotlighted person/screen.
  const stripRemotes = useMemo(() => {
    const list =
      spotlight?.kind === 'remote'
        ? remotes.filter((r) => String(r.uid) !== String(spotlight.uid))
        : remotes;
    const reserveScreen = sharing && spotlight?.kind !== 'screen' ? 1 : 0;
    const reserveLocal = spotlight?.kind !== 'local' ? 1 : 0;
    const used = reserveScreen + reserveLocal;
    const needOverflow = list.length + used > stripBudget;
    const slots = Math.max(0, stripBudget - used - (needOverflow ? 1 : 0));
    return {
      visible: list.slice(0, slots),
      hidden: Math.max(0, list.length - slots),
    };
  }, [remotes, spotlight, sharing]);

  const gridRemotes = useMemo(() => {
    const needOverflow = 1 + remotes.length > GRID_VISIBLE;
    const slots = Math.max(0, GRID_VISIBLE - 1 - (needOverflow ? 1 : 0));
    return {
      visible: remotes.slice(0, slots),
      hidden: Math.max(0, remotes.length - slots),
    };
  }, [remotes]);

  const tileShell = (opts: {
    key?: string;
    active?: boolean;
    onClick?: () => void;
    children: ReactNode;
    strip?: boolean;
    label: string;
  }) => (
    <button
      key={opts.key}
      type="button"
      onClick={opts.onClick}
      className="group relative overflow-hidden rounded-xl text-left transition-transform hover:scale-[1.02] focus:outline-none"
      style={{
        background: '#151c23',
        aspectRatio: '16 / 9',
        minWidth: opts.strip ? 140 : undefined,
        width: opts.strip ? 160 : undefined,
        flex: opts.strip ? '0 0 auto' : undefined,
        boxShadow: opts.active ? '0 0 0 2px #00b369' : undefined,
        cursor: opts.onClick ? 'pointer' : 'default',
      }}
      title={opts.onClick ? `Click to focus: ${opts.label}` : opts.label}
    >
      {opts.children}
    </button>
  );

  const renderLocal = (strip: boolean, isActive: boolean) =>
    tileShell({
      key: 'local',
      strip,
      active: isActive,
      label: `${displayName} (you)`,
      onClick: () => focusTile({ kind: 'local' }),
      children: (
        <>
          <div
            ref={attachLocalVideo}
            className="h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
          />
          {(phase === 'connecting' || !camOn) && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-white/70">
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
          <span className="pointer-events-none absolute bottom-1.5 left-2 rounded bg-black/55 px-1.5 py-0.5 text-[10.5px] font-medium text-white">
            {displayName} (you)
          </span>
          {!micOn && (
            <span className="pointer-events-none absolute bottom-1.5 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white">
              <MicOff size={12} />
            </span>
          )}
        </>
      ),
    });

  const renderScreen = (strip: boolean, isActive: boolean) =>
    tileShell({
      key: 'screen',
      strip,
      active: isActive,
      label: 'Shared screen',
      onClick: () => focusTile({ kind: 'screen' }),
      children: (
        <>
          <video
            ref={attachScreenVideo}
            autoPlay
            playsInline
            muted
            className="h-full w-full bg-black object-contain"
          />
          <span className="pointer-events-none absolute bottom-1.5 left-2 rounded bg-black/55 px-1.5 py-0.5 text-[10.5px] font-medium text-white">
            Your screen
          </span>
          <span className="pointer-events-none absolute right-2 top-2 rounded bg-[var(--green)] px-1.5 py-0.5 text-[9px] font-semibold text-white">
            Sharing
          </span>
        </>
      ),
    });

  const renderRemote = (r: RemoteTile, strip: boolean, isActive: boolean, fit: 'cover' | 'contain' = 'cover') =>
    tileShell({
      key: `remote-${r.uid}`,
      strip,
      active: isActive,
      label: `Participant ${String(r.uid).slice(-4)}`,
      onClick: () => focusTile({ kind: 'remote', uid: r.uid }),
      children: (
        <>
          <div
            ref={(el) => bindRemote(r.uid, el, fit)}
            className="h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
          />
          {!r.hasVideo && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-white/60">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full text-white"
                style={{ background: '#37474f' }}
              >
                <Users size={18} />
              </span>
            </div>
          )}
          <span className="pointer-events-none absolute bottom-1.5 left-2 rounded bg-black/55 px-1.5 py-0.5 text-[10.5px] font-medium text-white">
            Participant {String(r.uid).slice(-4)}
          </span>
        </>
      ),
    });

  const overflowTile = (count: number, strip: boolean) =>
    count > 0 ? (
      <div
        key="overflow"
        className="relative flex items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/20"
        style={{
          background: '#1a222b',
          aspectRatio: '16 / 9',
          minWidth: strip ? 140 : undefined,
          width: strip ? 160 : undefined,
          flex: strip ? '0 0 auto' : undefined,
          color: 'rgba(255,255,255,0.85)',
        }}
        title={`${count} more`}
      >
        <div className="text-center">
          <div className="font-display text-[28px] leading-none">+{count}</div>
          <div className="mt-1 text-[11px] text-white/55">others</div>
        </div>
      </div>
    ) : null;

  /** Large stage for the current spotlight. */
  const stageContent = (() => {
    if (!spotlight) return null;
    if (spotlight.kind === 'screen' && sharing) {
      return (
        <div className="relative h-full w-full">
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
        </div>
      );
    }
    if (spotlight.kind === 'local') {
      return (
        <div className="relative h-full w-full" style={{ background: '#151c23' }}>
          <div
            ref={attachLocalVideo}
            className="h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
          />
          {!camOn && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/70">
              <span
                className="flex h-20 w-20 items-center justify-center rounded-full text-[28px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #00b369, #1f5fa8)' }}
              >
                {initials(displayName)}
              </span>
              <span>Camera off</span>
            </div>
          )}
          <span className="absolute bottom-2.5 left-3 rounded-md bg-black/55 px-2 py-1 text-[11.5px] font-medium text-white">
            {displayName} (you)
          </span>
        </div>
      );
    }
    if (spotlight.kind === 'remote') {
      const r = remotes.find((x) => String(x.uid) === String(spotlight.uid));
      if (!r) return null;
      return (
        <div className="relative h-full w-full" style={{ background: '#151c23' }}>
          <div
            ref={(el) => bindRemote(r.uid, el, 'contain')}
            className="h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-contain"
          />
          {!r.hasVideo && (
            <div className="absolute inset-0 flex items-center justify-center text-white/60">
              <Users size={40} />
            </div>
          )}
          <span className="absolute bottom-2.5 left-3 rounded-md bg-black/55 px-2 py-1 text-[11.5px] font-medium text-white">
            Participant {String(r.uid).slice(-4)} · focused
          </span>
        </div>
      );
    }
    return null;
  })();

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

  const gridCols =
    1 + gridRemotes.visible.length + (gridRemotes.hidden > 0 ? 1 : 0) <= 1
      ? '1fr'
      : '1fr 1fr';

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-[22px] leading-tight">{title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
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
            <span className="text-[11px] text-[var(--ink-soft)]">Click a person to enlarge</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {focused && !(sharing && spotlight?.kind === 'screen') ? (
            <button
              type="button"
              onClick={showAll}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold"
              style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
              title={sharing ? 'Back to shared screen' : 'Show everyone equally'}
            >
              <LayoutGrid size={14} />
              {sharing ? 'Back to screen' : 'Show all'}
            </button>
          ) : null}
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
        {focused ? (
          <div className="flex flex-col gap-3">
            <div
              className="relative w-full overflow-hidden rounded-2xl transition-all duration-300"
              style={{
                background: '#0a0e12',
                height: isFullscreen ? 'calc(100vh - 220px)' : 420,
              }}
            >
              {stageContent}
            </div>

            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {/* Shared screen chip when someone else is focused */}
              {sharing && spotlight?.kind !== 'screen' ? renderScreen(true, false) : null}
              {spotlight?.kind !== 'local' ? renderLocal(true, false) : null}
              {stripRemotes.visible.map((r) => renderRemote(r, true, false))}
              {overflowTile(stripRemotes.hidden, true)}
              {remotes.length === 0 && phase === 'live' && spotlight?.kind === 'screen' ? (
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
          <div
            className="grid flex-1 gap-3"
            style={{ gridTemplateColumns: gridCols, alignContent: 'center' }}
          >
            {renderLocal(false, false)}
            {gridRemotes.visible.map((r) => renderRemote(r, false, false))}
            {overflowTile(gridRemotes.hidden, false)}
            {remotes.length === 0 && phase === 'live' ? (
              <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 text-white/50">
                <Users size={26} />
                <span className="text-[13.5px]">Waiting for others to join…</span>
                <span className="text-[12px] text-white/35">
                  Click any participant bubble later to enlarge them.
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
