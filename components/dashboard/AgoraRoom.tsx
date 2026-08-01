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
  MessageSquare,
  Send,
  X,
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
const GRID_VISIBLE = 6;
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
  const [chatOpen, setChatOpen] = useState(false);
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
  const chatEndRef = useRef<HTMLDivElement | null>(null);
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
    setChatOpen(true);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, chatOpen]);

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
  const focused = spotlight != null;
  const stripBudget = STRIP_VISIBLE;
  const someoneElseSharing = remotes.some((r) => r.sharing);

  const stripRemotes = useMemo(() => {
    const list =
      spotlight?.kind === 'remote'
        ? remotes.filter((r) => String(r.uid) !== String(spotlight.uid))
        : remotes;
    // Prefer screen-sharers first in the strip.
    const ordered = [...list].sort((a, b) => Number(b.sharing) - Number(a.sharing));
    const reserveScreen = sharing && spotlight?.kind !== 'screen' ? 1 : 0;
    const reserveLocal = spotlight?.kind !== 'local' ? 1 : 0;
    const used = reserveScreen + reserveLocal;
    const needOverflow = ordered.length + used > stripBudget;
    const slots = Math.max(0, stripBudget - used - (needOverflow ? 1 : 0));
    return {
      visible: ordered.slice(0, slots),
      hidden: Math.max(0, ordered.length - slots),
    };
  }, [remotes, spotlight, sharing, stripBudget]);

  const gridRemotes = useMemo(() => {
    const ordered = [...remotes].sort((a, b) => Number(b.sharing) - Number(a.sharing));
    const needOverflow = 1 + ordered.length > GRID_VISIBLE;
    const slots = Math.max(0, GRID_VISIBLE - 1 - (needOverflow ? 1 : 0));
    return {
      visible: ordered.slice(0, slots),
      hidden: Math.max(0, ordered.length - slots),
    };
  }, [remotes]);

  const tileShell = (opts: {
    key?: string;
    active?: boolean;
    speaking?: boolean;
    onClick?: () => void;
    children: ReactNode;
    strip?: boolean;
    label: string;
  }) => (
    <button
      key={opts.key}
      type="button"
      onClick={opts.onClick}
      className="group relative overflow-hidden rounded-xl text-left transition-shadow transition-transform hover:scale-[1.02] focus:outline-none"
      style={{
        background: '#151c23',
        aspectRatio: '16 / 9',
        minWidth: opts.strip ? 140 : undefined,
        width: opts.strip ? 160 : undefined,
        flex: opts.strip ? '0 0 auto' : undefined,
        boxShadow: opts.speaking
          ? '0 0 0 3px #00b369, 0 0 20px rgba(0,179,105,0.7)'
          : opts.active
            ? '0 0 0 2px #00b369'
            : undefined,
        cursor: opts.onClick ? 'pointer' : 'default',
      }}
      title={opts.onClick ? `Click to focus: ${opts.label}` : opts.label}
    >
      {opts.speaking ? (
        <span
          className="pointer-events-none absolute left-2 top-2 z-10 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-white"
          style={{ background: '#00b369' }}
        >
          Speaking
        </span>
      ) : null}
      {opts.children}
    </button>
  );

  const renderLocal = (strip: boolean, isActive: boolean) =>
    tileShell({
      key: 'local',
      strip,
      active: isActive,
      speaking: localSpeaking && micOn,
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
      speaking: localSpeaking && micOn,
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

  const renderRemote = (r: RemoteTile, strip: boolean, isActive: boolean) =>
    tileShell({
      key: `remote-${r.uid}`,
      strip,
      active: isActive || Boolean(r.sharing),
      speaking: Boolean(speakingMap[String(r.uid)]),
      label: r.sharing
        ? `${r.name || 'Participant'} screen`
        : r.name || `Participant ${String(r.uid).slice(-4)}`,
      onClick: () => focusTile({ kind: 'remote', uid: r.uid }),
      children: (
        <>
          <div
            ref={(el) => bindRemote(r.uid, el, r.sharing ? 'contain' : 'cover')}
            className={`h-full w-full [&_video]:h-full [&_video]:w-full ${
              r.sharing ? '[&_video]:object-contain' : '[&_video]:object-cover'
            }`}
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
            {r.name || `Participant ${String(r.uid).slice(-4)}`}
          </span>
          {r.sharing ? (
            <span className="pointer-events-none absolute right-2 top-2 inline-flex items-center gap-1 rounded bg-[#b91c1c] px-1.5 py-0.5 text-[9px] font-semibold text-white">
              <MonitorUp size={10} /> Screen
            </span>
          ) : null}
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
      >
        <div className="text-center">
          <div className="font-display text-[28px] leading-none">+{count}</div>
          <div className="mt-1 text-[11px] text-white/55">others</div>
        </div>
      </div>
    ) : null;

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
      const isShare = Boolean(r.sharing);
      return (
        <div className="relative h-full w-full" style={{ background: '#0a0e12' }}>
          <div
            ref={(el) => bindRemote(r.uid, el, isShare ? 'contain' : 'cover')}
            className={`h-full w-full [&_video]:h-full [&_video]:w-full ${
              isShare ? '[&_video]:object-contain' : '[&_video]:object-cover'
            }`}
          />
          {!r.hasVideo && (
            <div className="absolute inset-0 flex items-center justify-center text-white/60">
              <Users size={40} />
            </div>
          )}
          <span className="absolute bottom-2.5 left-3 rounded-md bg-black/55 px-2 py-1 text-[11.5px] font-medium text-white">
            {r.name || `Participant ${String(r.uid).slice(-4)}`}
            {isShare ? ' · screen share' : ' · focused'}
          </span>
          {isShare ? (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-[#b91c1c] px-2 py-1 text-[11px] font-semibold text-white">
              <MonitorUp size={12} /> Viewing their screen
            </span>
          ) : null}
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
    1 + gridRemotes.visible.length + (gridRemotes.hidden > 0 ? 1 : 0) <= 1 ? '1fr' : '1fr 1fr';

  return (
    <div className="mx-auto max-w-[1200px]">
      <style>{`
        @keyframes floatReact {
          0% { opacity: 0; transform: translateY(16px) scale(0.8); }
          15% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-120px) scale(1.15); }
        }
      `}</style>

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
            {sharing || someoneElseSharing ? (
              <span className="flex items-center gap-1 font-semibold" style={{ color: 'var(--green-deep)' }}>
                <MonitorUp size={12} /> {sharing ? 'You are sharing' : 'Someone is sharing'}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {focused &&
          !(
            (sharing && spotlight?.kind === 'screen') ||
            (spotlight?.kind === 'remote' &&
              remotes.some((r) => r.sharing && String(r.uid) === String(spotlight.uid)))
          ) ? (
            <button
              type="button"
              onClick={showAll}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold"
              style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
            >
              <LayoutGrid size={14} />
              {sharing || someoneElseSharing ? 'Back to screen' : 'Show all'}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setChatOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold"
            style={{
              borderColor: chatOpen ? 'var(--green)' : 'var(--line)',
              color: chatOpen ? 'var(--green-deep)' : 'var(--ink)',
            }}
          >
            <MessageSquare size={14} />
            Comments{chat.length ? ` (${chat.length})` : ''}
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold"
            style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </button>
        </div>
      </div>

      <div className={`grid gap-3 ${chatOpen ? 'lg:grid-cols-[1fr_300px]' : ''}`}>
        <div
          ref={stageRef}
          className="relative flex flex-col rounded-3xl p-3"
          style={{
            background: '#0C1116',
            minHeight: isFullscreen ? '100vh' : undefined,
          }}
        >
          {/* Floating reactions */}
          <div className="pointer-events-none absolute inset-x-0 bottom-24 top-3 z-20 overflow-hidden">
            {reactions.map((r) => (
              <div
                key={r.id}
                className="absolute bottom-0 flex flex-col items-center"
                style={{
                  left: `${r.left}%`,
                  animation: 'floatReact 2.6s ease-out forwards',
                }}
              >
                <span className="text-[28px] drop-shadow">{r.emoji}</span>
                <span className="rounded bg-black/50 px-1.5 text-[10px] text-white/80">{r.name}</span>
              </div>
            ))}
          </div>

          {focused ? (
            <div className="flex flex-col gap-3">
              <div
                className="relative w-full overflow-hidden rounded-2xl transition-shadow duration-200"
                style={{
                  background: '#0a0e12',
                  height: isFullscreen ? 'calc(100vh - 260px)' : 420,
                  boxShadow:
                    (spotlight?.kind === 'local' || spotlight?.kind === 'screen') &&
                    localSpeaking &&
                    micOn
                      ? '0 0 0 3px #00b369, 0 0 28px rgba(0,179,105,0.55)'
                      : spotlight?.kind === 'remote' &&
                          speakingMap[String(spotlight.uid)]
                        ? '0 0 0 3px #00b369, 0 0 28px rgba(0,179,105,0.55)'
                        : undefined,
                }}
              >
                {stageContent}
              </div>
              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                {sharing && spotlight?.kind !== 'screen' ? renderScreen(true, false) : null}
                {spotlight?.kind !== 'local' ? renderLocal(true, false) : null}
                {stripRemotes.visible.map((r) => renderRemote(r, true, false))}
                {overflowTile(stripRemotes.hidden, true)}
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
                </div>
              ) : null}
            </div>
          )}

          {/* Reactions + controls */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            {REACTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => void sendReaction(emoji)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[18px] transition hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.08)' }}
                title={`React ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div
            className="mt-3 flex flex-wrap items-center justify-center gap-3"
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
            >
              {sharing ? <MonitorUp size={18} /> : <ScreenShare size={18} />}
            </button>
            <button
              type="button"
              onClick={() => setChatOpen((v) => !v)}
              className="flex h-12 w-12 items-center justify-center rounded-full border transition-colors"
              style={{
                borderColor: 'rgba(255,255,255,0.18)',
                background: chatOpen ? 'var(--green)' : 'rgba(255,255,255,0.08)',
                color: '#fff',
              }}
            >
              <MessageSquare size={18} />
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

        {chatOpen ? (
          <aside
            className="flex max-h-[70vh] flex-col overflow-hidden rounded-3xl border lg:max-h-none"
            style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
          >
            <div
              className="flex items-center justify-between border-b px-4 py-3"
              style={{ borderColor: 'var(--line)' }}
            >
              <div>
                <p className="font-display text-[16px]">Comments</p>
                <p className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>
                  Live chat for this session
                </p>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="rounded-full p-1.5"
                style={{ color: 'var(--ink-soft)' }}
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-scroll px-4 py-3">
              {chat.length === 0 ? (
                <p className="py-8 text-center text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                  No comments yet. Say hi or drop a question.
                </p>
              ) : (
                chat.map((m) => (
                  <div key={m.id} className="text-[13px]">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold">{m.name}</span>
                      <span className="font-mono text-[10px]" style={{ color: 'var(--ink-soft)' }}>
                        {new Date(m.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="mt-0.5 leading-relaxed" style={{ color: 'var(--ink)' }}>
                      {m.text}
                    </p>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>
            <form
              className="flex gap-2 border-t p-3"
              style={{ borderColor: 'var(--line)' }}
              onSubmit={(e) => {
                e.preventDefault();
                void sendChat();
              }}
            >
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Write a comment…"
                maxLength={280}
                className="form-input min-w-0 flex-1 !rounded-full !py-2 text-[13px]"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white disabled:opacity-40"
                style={{ background: 'var(--green)' }}
              >
                <Send size={15} />
              </button>
            </form>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
