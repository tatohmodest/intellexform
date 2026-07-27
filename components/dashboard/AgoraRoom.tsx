'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  Mic,
  MicOff,
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

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const micTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const camTrackRef = useRef<ICameraVideoTrack | null>(null);
  const screenTrackRef = useRef<ILocalVideoTrack | null>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteRefs = useRef<Map<string | number, HTMLDivElement>>(new Map());

  // Session timer
  useEffect(() => {
    if (phase !== 'live') return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const leave = useCallback(async () => {
    const client = clientRef.current;
    micTrackRef.current?.close();
    camTrackRef.current?.close();
    screenTrackRef.current?.close();
    if (client) await client.leave().catch(() => {});
    setPhase('left');
  }, []);

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
          if (mediaType === 'audio') user.audioTrack?.play();
          setRemotes((prev) => {
            const others = prev.filter((r) => r.uid !== user.uid);
            return [...others, { uid: user.uid, hasVideo: Boolean(user.videoTrack) }];
          });
          if (mediaType === 'video') {
            // Wait a tick for the tile div to mount, then play into it.
            setTimeout(() => {
              const el = remoteRefs.current.get(user.uid);
              if (el) user.videoTrack?.play(el);
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
        if (camTrack && localVideoRef.current) camTrack.play(localVideoRef.current);

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

  async function toggleMic() {
    const track = micTrackRef.current;
    if (!track) return;
    await track.setEnabled(!micOn);
    setMicOn(!micOn);
  }

  async function toggleCam() {
    const track = camTrackRef.current;
    if (!track) return;
    await track.setEnabled(!camOn);
    setCamOn(!camOn);
    if (!camOn && localVideoRef.current) track.play(localVideoRef.current);
  }

  async function toggleShare() {
    const client = clientRef.current;
    if (!client) return;
    const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
    if (!sharing) {
      try {
        const screen = await AgoraRTC.createScreenVideoTrack({}, 'disable');
        const screenTrack = Array.isArray(screen) ? screen[0] : screen;
        screenTrackRef.current = screenTrack;
        if (camTrackRef.current) await client.unpublish(camTrackRef.current);
        await client.publish(screenTrack);
        if (localVideoRef.current) screenTrack.play(localVideoRef.current);
        screenTrack.on('track-ended', () => stopShare());
        setSharing(true);
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
    if (client && screenTrack) {
      await client.unpublish(screenTrack).catch(() => {});
      screenTrack.close();
      screenTrackRef.current = null;
      if (camTrackRef.current) {
        await client.publish(camTrackRef.current).catch(() => {});
        if (localVideoRef.current && camOn) camTrackRef.current.play(localVideoRef.current);
      }
    }
    setSharing(false);
  }

  async function handleLeave() {
    await leave();
    router.push('/dashboard/mentorship');
  }

  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const secs = String(elapsed % 60).padStart(2, '0');

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
      {/* Room header */}
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
            <span className="mono">{mins}:{secs}</span>
            <span className="flex items-center gap-1">
              <Users size={12} /> {remotes.length + 1} in room
            </span>
          </div>
        </div>
        <span className="mono rounded-full border px-3 py-1 text-[11px]" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
          room: {channel}
        </span>
      </div>

      {/* Video grid */}
      <div
        className="grid gap-3 rounded-3xl p-3"
        style={{
          background: '#0C1116',
          gridTemplateColumns:
            remotes.length === 0 ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        {/* Local tile */}
        <div className="relative aspect-video overflow-hidden rounded-2xl" style={{ background: '#151c23' }}>
          <div ref={localVideoRef} className="h-full w-full" />
          {(!camOn || phase === 'connecting') && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/70">
              {phase === 'connecting' ? (
                <>
                  <Loader2 size={26} className="animate-spin" />
                  <span className="text-[13px]">Joining room…</span>
                </>
              ) : (
                <>
                  <span
                    className="flex h-16 w-16 items-center justify-center rounded-full text-[22px] font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #00b369, #1f5fa8)' }}
                  >
                    {displayName
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((w) => w[0]?.toUpperCase())
                      .join('')}
                  </span>
                  <span className="text-[13px]">Camera off</span>
                </>
              )}
            </div>
          )}
          <span className="absolute bottom-2.5 left-3 rounded-md bg-black/55 px-2 py-1 text-[11.5px] font-medium text-white">
            {displayName} (you){sharing ? ' · sharing screen' : ''}
          </span>
          {!micOn && (
            <span className="absolute bottom-2.5 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white">
              <MicOff size={13} />
            </span>
          )}
        </div>

        {/* Remote tiles */}
        {remotes.map((r) => (
          <div key={String(r.uid)} className="relative aspect-video overflow-hidden rounded-2xl" style={{ background: '#151c23' }}>
            <div
              ref={(el) => {
                if (el) remoteRefs.current.set(r.uid, el);
              }}
              className="h-full w-full"
            />
            {!r.hasVideo && (
              <div className="absolute inset-0 flex items-center justify-center text-white/60">
                <span
                  className="flex h-16 w-16 items-center justify-center rounded-full text-[20px] font-bold text-white"
                  style={{ background: '#37474f' }}
                >
                  <Users size={22} />
                </span>
              </div>
            )}
            <span className="absolute bottom-2.5 left-3 rounded-md bg-black/55 px-2 py-1 text-[11.5px] font-medium text-white">
              Participant {String(r.uid).slice(-4)}
            </span>
          </div>
        ))}

        {remotes.length === 0 && phase === 'live' && (
          <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 text-white/50">
            <Users size={26} />
            <span className="text-[13.5px]">Waiting for your mentor to join…</span>
            <span className="text-[12px] text-white/35">Share this dashboard session link only with Intellex members.</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          onClick={toggleMic}
          className="flex h-12 w-12 items-center justify-center rounded-full border transition-colors"
          style={
            micOn
              ? { borderColor: 'var(--line)', background: 'var(--paper)' }
              : { borderColor: 'transparent', background: '#e5484d', color: '#fff' }
          }
          title={micOn ? 'Mute microphone' : 'Unmute microphone'}
        >
          {micOn ? <Mic size={18} /> : <MicOff size={18} />}
        </button>
        <button
          onClick={toggleCam}
          className="flex h-12 w-12 items-center justify-center rounded-full border transition-colors"
          style={
            camOn
              ? { borderColor: 'var(--line)', background: 'var(--paper)' }
              : { borderColor: 'transparent', background: '#e5484d', color: '#fff' }
          }
          title={camOn ? 'Turn camera off' : 'Turn camera on'}
        >
          {camOn ? <Video size={18} /> : <VideoOff size={18} />}
        </button>
        <button
          onClick={toggleShare}
          className="flex h-12 w-12 items-center justify-center rounded-full border transition-colors"
          style={
            sharing
              ? { borderColor: 'transparent', background: 'var(--green)', color: '#fff' }
              : { borderColor: 'var(--line)', background: 'var(--paper)' }
          }
          title={sharing ? 'Stop sharing' : 'Share your screen'}
        >
          {sharing ? <MonitorUp size={18} /> : <ScreenShare size={18} />}
        </button>
        <button
          onClick={handleLeave}
          className="btn !px-7 !py-3 text-[14px] text-white"
          style={{ background: '#e5484d' }}
        >
          <PhoneOff size={16} /> Leave
        </button>
      </div>
    </div>
  );
}
