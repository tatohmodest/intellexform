'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
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
  MessageSquare,
  Send,
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
  sharing?: boolean;
  name?: string;
}

type Spotlight =
  | { kind: 'local' }
  | { kind: 'screen' }
  | { kind: 'remote'; uid: string | number }
  | null;

type ChatMsg = { id: string; name: string; text: string; at: number };
type FloatReaction = { id: string; emoji: string; name: string; left: number };

const STRIP_VISIBLE = 8;
const REACTIONS = ['👍', '👏', '❤️', '🔥', '😂', '🎉'] as const;

type Signal =
  | { t: 'share'; on: boolean; name: string }
  | { t: 'react'; e: string; name: string }
  | { t: 'chat'; m: string; name: string };

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

function decodeSignal(payload: Uint8Array): Signal | null {
  try {
    const raw = new TextDecoder().decode(payload);
    const msg = JSON.parse(raw) as Signal;
    if (!msg || typeof msg !== 'object' || !('t' in msg)) return null;
    return msg;
  } catch {
    return null;
  }
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
  const [showAllPeople, setShowAllPeople] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [reactions, setReactions] = useState<FloatReaction[]>([]);
  /** uid → volume level (0-100) for users currently speaking */
  const [speakingMap, setSpeakingMap] = useState<Record<string, number>>({});
  const [localSpeaking, setLocalSpeaking] = useState(false);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const micTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const camTrackRef = useRef<ICameraVideoTrack | null>(null);
  const screenTrackRef = useRef<ILocalVideoTrack | null>(null);
  const localVideoRef = useRef<HTMLDivElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenPreviewCloneRef = useRef<MediaStreamTrack | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const chatListRef = useRef<HTMLDivElement | null>(null);
  const remoteRefs = useRef<Map<string | number, HTMLDivElement>>(new Map());
  const remoteUsersRef = useRef<Map<string | number, IAgoraRTCRemoteUser>>(new Map());
  const remoteSharingRef = useRef<Set<string>>(new Set());
  const sharingRef = useRef(false);
  const displayNameRef = useRef(displayName);
  const localUidRef = useRef<string | number | null>(null);

  useEffect(() => {
    displayNameRef.current = displayName;
  }, [displayName]);

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
      const clone = track.getMediaStreamTrack().clone();
      screenPreviewCloneRef.current = clone;
      video.srcObject = new MediaStream([clone]);
      video.muted = true;
      video.playsInline = true;
      void video.play().catch(() => {});
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

  const sendSignal = useCallback(async (msg: Signal) => {
    const client = clientRef.current as (IAgoraRTCClient & {
      sendStreamMessage?: (
        message: { payload: string } | string,
        needRetry?: boolean,
      ) => Promise<void>;
    }) | null;
    if (!client?.sendStreamMessage) return;
    try {
      await client.sendStreamMessage({ payload: JSON.stringify(msg) }, true);
    } catch (err) {
      console.error('signal send failed:', err);
    }
  }, []);

  const pushReaction = useCallback((emoji: string, name: string) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const left = 12 + Math.random() * 70;
    setReactions((prev) => [...prev.slice(-20), { id, emoji, name, left }]);
    window.setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2800);
  }, []);

  const pushChat = useCallback((name: string, text: string) => {
    const clean = text.trim().slice(0, 280);
    if (!clean) return;
    setChat((prev) => [
      ...prev.slice(-80),
      { id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, name, text: clean, at: Date.now() },
    ]);
  }, []);

  // Keep the newest message in view without scrolling the whole page.
  useEffect(() => {
    const list = chatListRef.current;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
  }, [chat]);

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
    if (sharingRef.current) {
      const c = client as (IAgoraRTCClient & {
        sendStreamMessage?: (
          message: { payload: string },
          needRetry?: boolean,
        ) => Promise<void>;
      }) | null;
      await c
        ?.sendStreamMessage?.(
          { payload: JSON.stringify({ t: 'share', on: false, name: displayNameRef.current } satisfies Signal) },
          true,
        )
        .catch(() => {});
    }
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

        const playRemote = (uid: string | number, fit: 'cover' | 'contain' = 'cover') => {
          const user = remoteUsersRef.current.get(uid);
          const el = remoteRefs.current.get(uid);
          if (user?.videoTrack && el) {
            user.videoTrack.play(el, { fit });
          }
        };

        client.on('user-published', async (user: IAgoraRTCRemoteUser, mediaType) => {
          await client.subscribe(user, mediaType);
          remoteUsersRef.current.set(user.uid, user);
          if (mediaType === 'audio') user.audioTrack?.play();

          const uidKey = String(user.uid);
          const isSharing = remoteSharingRef.current.has(uidKey);

          setRemotes((prev) => {
            const others = prev.filter((r) => r.uid !== user.uid);
            const existing = prev.find((r) => r.uid === user.uid);
            return [
              ...others,
              {
                uid: user.uid,
                hasVideo: Boolean(user.videoTrack),
                sharing: isSharing || existing?.sharing,
                name: existing?.name,
              },
            ];
          });

          if (mediaType === 'video') {
            // Auto-focus a remote screen share so viewers actually see it large.
            if (isSharing) {
              setSpotlight({ kind: 'remote', uid: user.uid });
            }
            setTimeout(() => playRemote(user.uid, isSharing ? 'contain' : 'cover'), 60);
            setTimeout(() => playRemote(user.uid, isSharing ? 'contain' : 'cover'), 300);
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
          const uidKey = String(user.uid);
          remoteSharingRef.current.delete(uidKey);
          setRemotes((prev) => prev.filter((r) => r.uid !== user.uid));
          remoteRefs.current.delete(user.uid);
          remoteUsersRef.current.delete(user.uid);
          setSpotlight((prev) =>
            prev?.kind === 'remote' && String(prev.uid) === uidKey
              ? sharingRef.current
                ? { kind: 'screen' }
                : null
              : prev,
          );
        });

        client.on('stream-message', (uid, payload) => {
          const msg = decodeSignal(payload);
          if (!msg) return;
          const uidKey = String(uid);

          if (msg.t === 'share') {
            if (msg.on) {
              remoteSharingRef.current.add(uidKey);
              setRemotes((prev) => {
                const found = prev.find((r) => String(r.uid) === uidKey);
                if (!found) {
                  return [
                    ...prev,
                    { uid, hasVideo: true, sharing: true, name: msg.name },
                  ];
                }
                return prev.map((r) =>
                  String(r.uid) === uidKey ? { ...r, sharing: true, name: msg.name } : r,
                );
              });
              // Spotlight their screen for everyone else.
              if (!sharingRef.current) {
                setSpotlight({ kind: 'remote', uid });
              }
              setTimeout(() => playRemote(uid, 'contain'), 80);
              setTimeout(() => playRemote(uid, 'contain'), 350);
              pushChat('System', `${msg.name} started sharing their screen`);
            } else {
              remoteSharingRef.current.delete(uidKey);
              setRemotes((prev) =>
                prev.map((r) =>
                  String(r.uid) === uidKey ? { ...r, sharing: false } : r,
                ),
              );
              setSpotlight((prev) =>
                prev?.kind === 'remote' && String(prev.uid) === uidKey
                  ? sharingRef.current
                    ? { kind: 'screen' }
                    : null
                  : prev,
              );
              pushChat('System', `${msg.name} stopped sharing`);
            }
            return;
          }

          if (msg.t === 'react') {
            pushReaction(msg.e, msg.name);
            return;
          }

          if (msg.t === 'chat') {
            pushChat(msg.name, msg.m);
          }
        });

        await client.join(data.appId, data.channel, data.token ?? null, data.uid);
        localUidRef.current = data.uid;

        // Glow the tile of whoever is talking.
        try {
          (client as IAgoraRTCClient & { enableAudioVolumeIndicator?: () => void })
            .enableAudioVolumeIndicator?.();
        } catch {
          /* older SDK builds */
        }
        client.on('volume-indicator', (volumes: Array<{ uid: string | number; level: number }>) => {
          const next: Record<string, number> = {};
          let meSpeaking = false;
          const myUid = localUidRef.current;
          for (const v of volumes) {
            if (v.level < 40) continue;
            next[String(v.uid)] = v.level;
            if (myUid != null && String(v.uid) === String(myUid)) meSpeaking = true;
          }
          setSpeakingMap(next);
          setLocalSpeaking(meSpeaking);
        });

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

  // Re-bind remote spotlight video when focus changes.
  useEffect(() => {
    if (spotlight?.kind !== 'remote') return;
    const uid = spotlight.uid;
    const fit = remoteSharingRef.current.has(String(uid)) ? 'contain' : 'cover';
    const play = () => {
      const user = remoteUsersRef.current.get(uid);
      const el = remoteRefs.current.get(uid);
      if (user?.videoTrack && el) user.videoTrack.play(el, { fit });
    };
    const t1 = window.setTimeout(play, 50);
    const t2 = window.setTimeout(play, 250);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [spotlight]);

  function focusTile(next: Spotlight) {
    setSpotlight((prev) => {
      if (sameSpotlight(prev, next)) {
        if (sharing) return { kind: 'screen' };
        const sharer = remotes.find((r) => r.sharing);
        return sharer ? { kind: 'remote', uid: sharer.uid } : null;
      }
      return next;
    });
  }

  function showAll() {
    if (sharing) {
      setSpotlight({ kind: 'screen' });
      return;
    }
    const sharer = remotes.find((r) => r.sharing);
    setSpotlight(sharer ? { kind: 'remote', uid: sharer.uid } : null);
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

        // Tell everyone so they can enlarge this screen.
        await sendSignal({ t: 'share', on: true, name: displayName });

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
        /* cancelled */
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
    await sendSignal({ t: 'share', on: false, name: displayName });
    const sharer = remotes.find((r) => r.sharing);
    setSpotlight(sharer ? { kind: 'remote', uid: sharer.uid } : null);
  }

  async function sendReaction(emoji: string) {
    pushReaction(emoji, displayName);
    await sendSignal({ t: 'react', e: emoji, name: displayName });
  }

  async function sendChat() {
    const text = chatInput.trim();
    if (!text) return;
    setChatInput('');
    pushChat(displayName, text);
    await sendSignal({ t: 'chat', m: text, name: displayName });
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
      const useFit = remoteSharingRef.current.has(String(uid)) ? 'contain' : fit;
      user.videoTrack.play(el, { fit: useFit });
    }
  }

  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const secs = String(elapsed % 60).padStart(2, '0');
  const someoneElseSharing = remotes.some((r) => r.sharing);
  const peopleCount = remotes.length + 1;

  // What fills the big stage: the tile someone picked (or the screen being shared),
  // else the first other person in the room, else you.
  const picked: Spotlight =
    spotlight?.kind === 'screen' && !sharing
      ? null
      : spotlight?.kind === 'remote' && !remotes.some((r) => String(r.uid) === String(spotlight.uid))
        ? null
        : spotlight;
  const stage: Exclude<Spotlight, null> =
    picked ?? (remotes[0] ? { kind: 'remote', uid: remotes[0].uid } : { kind: 'local' });
  const stageRemote =
    stage.kind === 'remote' ? remotes.find((r) => String(r.uid) === String(stage.uid)) ?? null : null;

  const strip = (() => {
    const list = stageRemote ? remotes.filter((r) => r !== stageRemote) : remotes;
    const ordered = [...list].sort((a, b) => Number(b.sharing) - Number(a.sharing));
    const used = (sharing && stage.kind !== 'screen' ? 1 : 0) + (stage.kind !== 'local' ? 1 : 0);
    const needOverflow = ordered.length + used > STRIP_VISIBLE;
    const slots = Math.max(0, STRIP_VISIBLE - used - (needOverflow ? 1 : 0));
    return { visible: ordered.slice(0, slots), hidden: Math.max(0, ordered.length - slots) };
  })();

  const stageSpeaking =
    stage.kind === 'remote' ? Boolean(speakingMap[String(stage.uid)]) : localSpeaking && micOn;
  const stageName =
    stage.kind === 'remote'
      ? stageRemote?.name || `Participant ${String(stage.uid).slice(-4)}`
      : `${displayName} (you)`;

  const remoteName = (r: RemoteTile) => r.name || `Participant ${String(r.uid).slice(-4)}`;

  const avatar = (name: string, size: number, tone: 'green' | 'sky' = 'green') => (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.38),
        background: tone === 'green' ? 'var(--green)' : 'var(--sky)',
      }}
    >
      {initials(name) || '?'}
    </span>
  );

  /** Small participant tile for the strip under the stage. */
  const tile = (opts: {
    key: string;
    label: string;
    speaking?: boolean;
    badge?: ReactNode;
    onClick: () => void;
    children: ReactNode;
  }) => (
    <button
      key={opts.key}
      type="button"
      onClick={opts.onClick}
      title={`Show ${opts.label} on the main stage`}
      className="group relative aspect-[4/3] w-[148px] shrink-0 overflow-hidden rounded-2xl text-left transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sky)] sm:w-[172px]"
      style={{
        background: 'var(--navy)',
        boxShadow: opts.speaking ? '0 0 0 3px var(--green)' : '0 1px 2px rgba(12,17,22,0.08)',
      }}
    >
      {opts.children}
      <span className="pointer-events-none absolute inset-x-2 bottom-2 flex items-center gap-1.5 truncate rounded-full bg-black/40 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
        <span className="truncate">{opts.label}</span>
      </span>
      {opts.badge ? <span className="pointer-events-none absolute right-2 top-2">{opts.badge}</span> : null}
    </button>
  );

  const cameraOff = (name: string, big = false) => (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/75">
      {avatar(name, big ? 84 : 44)}
      <span className={big ? 'text-[13px]' : 'text-[11px]'}>Camera off</span>
    </div>
  );

  const localTile = () =>
    tile({
      key: 'local',
      label: `${displayName} (you)`,
      speaking: localSpeaking && micOn,
      onClick: () => focusTile({ kind: 'local' }),
      badge: !micOn ? (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e5484d] text-white">
          <MicOff size={12} />
        </span>
      ) : null,
      children: (
        <>
          <div ref={attachLocalVideo} className="h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover" />
          {phase === 'connecting' ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-white/75">
              <Loader2 size={20} className="animate-spin" />
            </div>
          ) : !camOn ? (
            cameraOff(displayName)
          ) : null}
        </>
      ),
    });

  const screenTile = () =>
    tile({
      key: 'screen',
      label: 'Your screen',
      onClick: () => focusTile({ kind: 'screen' }),
      badge: (
        <span className="rounded-full bg-[var(--green)] px-2 py-0.5 text-[10px] font-semibold text-white">Sharing</span>
      ),
      children: (
        <video ref={attachScreenVideo} autoPlay playsInline muted className="h-full w-full bg-black object-contain" />
      ),
    });

  const remoteTile = (r: RemoteTile) =>
    tile({
      key: `remote-${r.uid}`,
      label: r.sharing ? `${remoteName(r)} · screen` : remoteName(r),
      speaking: Boolean(speakingMap[String(r.uid)]),
      onClick: () => focusTile({ kind: 'remote', uid: r.uid }),
      badge: r.sharing ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--sky)] px-2 py-0.5 text-[10px] font-semibold text-white">
          <MonitorUp size={10} /> Screen
        </span>
      ) : null,
      children: (
        <>
          <div
            ref={(el) => bindRemote(r.uid, el, r.sharing ? 'contain' : 'cover')}
            className={`h-full w-full [&_video]:h-full [&_video]:w-full ${
              r.sharing ? '[&_video]:object-contain' : '[&_video]:object-cover'
            }`}
          />
          {!r.hasVideo ? cameraOff(remoteName(r)) : null}
        </>
      ),
    });

  const stageContent = (() => {
    if (stage.kind === 'screen') {
      return (
        <video
          ref={attachScreenVideo}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 h-full w-full bg-black object-contain"
        />
      );
    }
    if (stage.kind === 'local') {
      return (
        <>
          <div
            ref={attachLocalVideo}
            className="absolute inset-0 [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
          />
          {phase === 'connecting' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/75">
              <Loader2 size={28} className="animate-spin" />
              <span className="text-[13px]">Joining the class…</span>
            </div>
          ) : !camOn ? (
            cameraOff(displayName, true)
          ) : null}
        </>
      );
    }
    if (!stageRemote) return null;
    const isShare = Boolean(stageRemote.sharing);
    return (
      <>
        <div
          ref={(el) => bindRemote(stageRemote.uid, el, isShare ? 'contain' : 'cover')}
          className={`absolute inset-0 [&_video]:h-full [&_video]:w-full ${
            isShare ? '[&_video]:object-contain' : '[&_video]:object-cover'
          }`}
        />
        {!stageRemote.hasVideo ? cameraOff(remoteName(stageRemote), true) : null}
      </>
    );
  })();

  const railButton = (opts: {
    label: string;
    onClick: () => void;
    icon: ReactNode;
    tone?: 'glass' | 'off' | 'on' | 'end';
  }) => {
    const tone = opts.tone ?? 'glass';
    const style =
      tone === 'end'
        ? { background: '#e5484d', color: '#fff' }
        : tone === 'off'
          ? { background: '#fff', color: '#e5484d' }
          : tone === 'on'
            ? { background: 'var(--green)', color: '#fff' }
            : { background: 'rgba(255,255,255,0.18)', color: '#fff' };
    return (
      <button
        type="button"
        onClick={opts.onClick}
        aria-label={opts.label}
        title={opts.label}
        className={`flex items-center justify-center rounded-full backdrop-blur-md transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
          tone === 'end' ? 'h-12 w-12 shadow-lg' : 'h-11 w-11 border border-white/25'
        }`}
        style={style}
      >
        {opts.icon}
      </button>
    );
  };

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

  const people = [
    { key: 'local', name: `${displayName} (you)`, video: camOn, speaking: localSpeaking && micOn, micOff: !micOn },
    ...remotes.map((r) => ({
      key: String(r.uid),
      name: remoteName(r),
      video: r.hasVideo,
      speaking: Boolean(speakingMap[String(r.uid)]),
      micOff: false,
    })),
  ];
  const PEOPLE_PREVIEW = 5;
  const shownPeople = showAllPeople ? people : people.slice(0, PEOPLE_PREVIEW);

  return (
    <div className="mx-auto max-w-[1320px]">
      <style>{`
        @keyframes floatReact {
          0% { opacity: 0; transform: translateY(16px) scale(0.8); }
          15% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-120px) scale(1.15); }
        }
      `}</style>

      {/* Header: title and room facts as chips */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-[22px] leading-tight sm:text-[26px]">{title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] font-semibold">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
              style={
                phase === 'live'
                  ? { background: '#fde8e8', color: '#c92a2f' }
                  : { background: 'var(--paper-dim)', color: 'var(--ink-soft)' }
              }
            >
              <span
                className={`inline-block h-2 w-2 rounded-full ${phase === 'live' ? 'animate-pulse' : ''}`}
                style={{ background: phase === 'live' ? '#e5484d' : 'var(--ink-soft)' }}
              />
              {phase === 'live' ? 'Live' : 'Connecting…'}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1" style={{ background: 'var(--pastel-sky)', color: 'var(--blue-ink)' }}>
              <Users size={13} /> {peopleCount} in class
            </span>
            {sharing || someoneElseSharing ? (
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1" style={{ background: 'var(--pastel-mint)', color: 'var(--green-deep)' }}>
                <MonitorUp size={13} /> {sharing ? 'You are presenting' : 'Screen shared'}
              </span>
            ) : null}
            {picked ? (
              <button
                type="button"
                onClick={showAll}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1"
                style={{ borderColor: 'var(--line)', color: 'var(--ink)', background: 'var(--paper)' }}
              >
                <LayoutGrid size={13} /> Reset view
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Stage + participant strip */}
        <div className="min-w-0">
          <div
            ref={stageRef}
            className="relative overflow-hidden rounded-[28px]"
            style={{
              background: 'var(--navy)',
              height: isFullscreen ? '100vh' : 'clamp(300px, 56vw, 560px)',
              boxShadow: stageSpeaking ? '0 0 0 3px var(--green)' : '0 10px 30px rgba(18,50,79,0.14)',
              transition: 'box-shadow 200ms',
            }}
          >
            {stageContent}

            {/* Floating reactions */}
            <div className="pointer-events-none absolute inset-x-0 bottom-20 top-3 z-20 overflow-hidden">
              {reactions.map((r) => (
                <div
                  key={r.id}
                  className="absolute bottom-0 flex flex-col items-center"
                  style={{ left: `${r.left}%`, animation: 'floatReact 2.6s ease-out forwards' }}
                >
                  <span className="text-[28px] drop-shadow">{r.emoji}</span>
                  <span className="rounded bg-black/50 px-1.5 text-[10px] text-white/80">{r.name}</span>
                </div>
              ))}
            </div>

            {/* Who is on stage */}
            <div className="absolute left-3 top-3 z-20 flex max-w-[60%] items-center gap-2 rounded-full bg-black/35 py-1 pl-1 pr-3 text-[12.5px] font-medium text-white backdrop-blur-md">
              {avatar(stage.kind === 'screen' ? displayName : stageName, 26, 'sky')}
              <span className="truncate">{stage.kind === 'screen' ? 'Your screen' : stageName}</span>
              {stageSpeaking ? <Mic size={13} className="shrink-0 text-[#7ee2b0]" /> : null}
            </div>

            {/* Live timer */}
            <div className="absolute right-3 top-3 z-20 flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur-md">
              <span className={`h-2 w-2 rounded-full ${phase === 'live' ? 'animate-pulse bg-[#e5484d]' : 'bg-white/50'}`} />
              <span className="mono tabular-nums">{mins}:{secs}</span>
            </div>

            {/* Controls: a vertical rail on the right, a bottom bar on phones */}
            <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 sm:bottom-auto sm:left-auto sm:right-3 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 sm:flex-col">
              {railButton({
                label: micOn ? 'Mute microphone' : 'Unmute microphone',
                onClick: () => void toggleMic(),
                icon: micOn ? <Mic size={18} /> : <MicOff size={18} />,
                tone: micOn ? 'glass' : 'off',
              })}
              {railButton({
                label: camOn ? 'Turn camera off' : 'Turn camera on',
                onClick: () => void toggleCam(),
                icon: camOn ? <Video size={18} /> : <VideoOff size={18} />,
                tone: camOn ? 'glass' : 'off',
              })}
              {railButton({
                label: 'Leave class',
                onClick: () => void handleLeave(),
                icon: <PhoneOff size={19} />,
                tone: 'end',
              })}
              {railButton({
                label: sharing ? 'Stop sharing your screen' : 'Share your screen',
                onClick: () => void toggleShare(),
                icon: sharing ? <MonitorUp size={18} /> : <ScreenShare size={18} />,
                tone: sharing ? 'on' : 'glass',
              })}
              <span className="hidden sm:contents">
                {railButton({
                  label: isFullscreen ? 'Exit full screen' : 'Full screen',
                  onClick: () => void toggleFullscreen(),
                  icon: isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />,
                })}
              </span>
            </div>

            {/* Reactions */}
            <div className="absolute bottom-3 left-3 z-20 hidden items-center gap-1 rounded-full bg-black/35 p-1 backdrop-blur-md sm:flex">
              {REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => void sendReaction(emoji)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[16px] transition hover:scale-110 hover:bg-white/15"
                  title={`React ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Reactions on phones sit under the stage */}
          <div className="mt-3 flex justify-center gap-1 sm:hidden">
            {REACTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => void sendReaction(emoji)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[17px]"
                style={{ background: 'var(--paper-dim)' }}
                title={`React ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Everyone else */}
          <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
            {sharing && stage.kind !== 'screen' ? screenTile() : null}
            {stage.kind !== 'local' ? localTile() : null}
            {strip.visible.map((r) => remoteTile(r))}
            {strip.hidden > 0 ? (
              <div
                className="flex aspect-[4/3] w-[148px] shrink-0 flex-col items-center justify-center rounded-2xl sm:w-[172px]"
                style={{ background: 'var(--pastel-sky)', color: 'var(--blue-ink)' }}
              >
                <span className="font-display text-[26px] leading-none">{strip.hidden}+</span>
                <span className="mt-1 text-[11px]">more in class</span>
              </div>
            ) : null}
            {remotes.length === 0 && phase === 'live' ? (
              <div
                className="flex aspect-[4/3] w-[172px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed text-center text-[12px]"
                style={{ borderColor: 'rgba(12,17,22,0.15)', color: 'var(--ink-soft)' }}
              >
                <Users size={20} />
                Waiting for others to join…
              </div>
            ) : null}
          </div>
        </div>

        {/* Side panel: participants and live chat */}
        <div className="flex min-w-0 flex-col gap-4">
          <section className="overflow-hidden rounded-3xl border" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
            <header className="flex items-center gap-2 px-4 py-3 text-[13.5px] font-semibold" style={{ background: 'var(--pastel-sky)', color: 'var(--blue-ink)' }}>
              <Users size={15} /> Participants {peopleCount}
            </header>
            <ul className="space-y-1.5 p-2.5">
              {shownPeople.map((p) => (
                <li
                  key={p.key}
                  className="flex items-center gap-2.5 rounded-2xl px-2.5 py-2"
                  style={{ background: p.speaking ? 'var(--pastel-mint)' : 'var(--paper-dim)' }}
                >
                  {avatar(p.name, 30, p.key === 'local' ? 'green' : 'sky')}
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{p.name}</span>
                  <span className="flex items-center gap-1.5" style={{ color: 'var(--ink-soft)' }}>
                    {p.video ? <Video size={15} /> : <VideoOff size={15} />}
                    {p.micOff ? (
                      <MicOff size={15} className="text-[#e5484d]" />
                    ) : p.speaking ? (
                      <Mic size={15} className="text-[var(--green-deep)]" />
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
            {people.length > PEOPLE_PREVIEW ? (
              <button
                type="button"
                onClick={() => setShowAllPeople((v) => !v)}
                className="mx-auto mb-3 flex items-center gap-1 rounded-full border px-3 py-1 text-[11.5px] font-semibold"
                style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
              >
                {showAllPeople ? 'Show less' : `See ${people.length - PEOPLE_PREVIEW} more`}
              </button>
            ) : null}
          </section>

          <section
            className="flex h-[440px] min-h-0 flex-col overflow-hidden rounded-3xl border lg:h-[min(52vh,520px)]"
            style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
          >
            <header className="flex items-center gap-2 px-4 py-3 text-[13.5px] font-semibold" style={{ background: 'var(--pastel-mint)', color: 'var(--green-deep)' }}>
              <MessageSquare size={15} /> Live chat
            </header>
            <div ref={chatListRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
              {chat.length === 0 ? (
                <p className="py-10 text-center text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                  No messages yet. Say hi or ask a question.
                </p>
              ) : (
                chat.map((m) => {
                  const mine = m.name === displayName;
                  const time = new Date(m.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div key={m.id} className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                      <p
                        className={`max-w-[88%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed [overflow-wrap:anywhere] ${
                          mine ? 'rounded-br-md text-white' : 'rounded-bl-md border'
                        }`}
                        style={
                          mine
                            ? { background: 'var(--sky)' }
                            : { background: 'var(--paper-dim)', borderColor: 'var(--line)', color: 'var(--ink)' }
                        }
                      >
                        {m.text}
                      </p>
                      <span className="mt-1 flex items-center gap-1.5 px-1 text-[11px]" style={{ color: 'var(--ink-soft)' }}>
                        {mine ? null : <span className="font-semibold" style={{ color: 'var(--ink)' }}>{m.name}</span>}
                        <span className="mono">{time}</span>
                      </span>
                    </div>
                  );
                })
              )}
            </div>
            <form
              className="flex items-center gap-2 border-t p-2.5"
              style={{ borderColor: 'var(--line)' }}
              onSubmit={(e) => {
                e.preventDefault();
                void sendChat();
              }}
            >
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message…"
                maxLength={280}
                aria-label="Chat message"
                className="form-input min-w-0 flex-1 !rounded-full !py-2 text-[13px]"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                aria-label="Send message"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white disabled:opacity-40"
                style={{ background: 'var(--sky)' }}
              >
                <Send size={15} />
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
