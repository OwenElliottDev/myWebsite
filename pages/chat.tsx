import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { joinRoom, DataPayload, Room, selfId } from 'trystero';
import {
  getMessagesFromDB,
  updateMessagesToDB,
  getNameFromDB,
  updateNameToDB,
} from '@/utils/chatDB';

type NameMap = Record<string, DataPayload>;
export interface ChatMessage {
  name: string;
  message: string;
  timestamp: number;
}

const CONFIG = { appId: 'oe.dev' } as const;

function consolidateMessages(messages: ChatMessage[]): ChatMessage[] {
  messages.sort((a, b) => a.timestamp - b.timestamp);

  const uniqueMessages: ChatMessage[] = [];
  const seenMessages = new Set<string>();
  for (const message of messages) {
    const messageKey = `${message.name}|${message.message}|${message.timestamp}`;
    if (!seenMessages.has(messageKey)) {
      seenMessages.add(messageKey);
      uniqueMessages.push(message);
    }
  }
  return uniqueMessages;
}

const nowSeconds = () => Math.floor(Date.now() / 1000);

type RoomMessageChatProps = {
  messages: ChatMessage[];
  currentUserName: string;
  onSendMessage: (message: ChatMessage) => void;
};

const MessageChat = ({ messages, currentUserName, onSendMessage }: RoomMessageChatProps) => {
  const [draft, setDraft] = useState('');

  const send = (text: string) => {
    const msg: ChatMessage = { name: currentUserName, message: text, timestamp: nowSeconds() };
    onSendMessage(msg);
  };

  return (
    <div className="room-chat">
      {messages.map((m, i) => (
        <div
          key={i}
          className={`chat-message ${m.name === currentUserName ? 'current-user-message' : 'other-user-message'}`}
        >
          <span className="chat-name">{m.name}</span>
          <span className="chat-text">{m.message}</span>
          <span className="chat-timestamp">
            {new Date(m.timestamp * 1000).toLocaleTimeString()}
          </span>
        </div>
      ))}
      <div className="chat-input-container">
        <textarea
          className="chat-input"
          placeholder="Type your message here..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (draft.trim()) {
                send(draft);
                setDraft('');
              }
            }
          }}
        />
        <button
          className="chat-send-button"
          onClick={() => {
            if (draft.trim()) {
              send(draft);
              setDraft('');
            }
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

const Chat = () => {
  const router = useRouter();
  const roomSlug = router.query.room;
  const [roomIdInput, setRoomIdInput] = useState('');
  const [yourName, setYourName] = useState('');
  const [idsToNames, setIdsToNames] = useState<NameMap>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selfStream, setSelfStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (typeof roomSlug != 'string') return;
    setMessages(getMessagesFromDB(roomSlug));
    let nameFromDB = getNameFromDB(roomSlug);

    if (nameFromDB !== null) {
      setYourName(nameFromDB);
    }
  }, [roomSlug]);

  const room: Room | null = useMemo(
    () => (router.isReady && typeof roomSlug === 'string' ? joinRoom(CONFIG, roomSlug) : null),
    [router.isReady, roomSlug],
  );

  const nameRef = useRef('');
  useEffect(() => {
    nameRef.current = yourName;
    if (room && yourName) {
      updateNameToDB(roomSlug as string, yourName);
    }
  }, [yourName]);

  const messagesRef = useRef<ChatMessage[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
    if (roomSlug && messages.length > 0) {
      updateMessagesToDB(roomSlug as string, messages);
    }
  }, [messages]);

  useEffect(() => {
    if (!room) return;

    const [sendName, getName] = room.makeAction<string>('name');
    const [sendMsg, getMsg] = room.makeAction<string>('message');

    getName((n, id) => setIdsToNames((p) => ({ ...p, [id]: n })));

    getMsg((raw) => setMessages((p) => consolidateMessages([...p, JSON.parse(raw)])));

    if (nameRef.current) sendName(nameRef.current);

    room.onPeerJoin((peerId) => {
      setIdsToNames((p) => ({ ...p, [peerId]: 'Unknown' }));
      if (nameRef.current) sendName(nameRef.current, peerId);
      messagesRef.current.forEach((m) => sendMsg(JSON.stringify(m), peerId));
    });

    return () => void room.leave();
  }, [room]);

  useEffect(() => {
    if (!room || !yourName) return;
    const [sendName] = room.makeAction<string>('name');
    sendName(yourName);
  }, [room, yourName]);

  useEffect(() => {
    if (room) setIdsToNames((p) => ({ ...p, [selfId]: yourName || 'Unknown' }));
  }, [room, yourName]);

  const broadcastMessage = (m: ChatMessage) => {
    if (!room) return;
    setMessages((p) => [...p, m]);
    const [sendMsg] = room.makeAction<string>('message');
    sendMsg(JSON.stringify(m));
  };

  const startVoiceStream = async (r: Room | null) => {
    if (!r) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    setSelfStream(stream);
  };

  const removeVoiceStream = async (r: Room | null) => {
    if (!r || !selfStream) return;
    r.removeStream(selfStream);
    selfStream.getTracks().forEach((t) => t.stop());
    setSelfStream(null);
  };

  if (!router.isReady || !room)
    return (
      <div className="page">
        <Head>
          <title>Chat</title>
          <meta name="og:title" content="Chat" />
          <meta name="og:description" content="Peer-to-peer chat interface with WebRTC" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="noindex"></meta>
        </Head>
        <h1>Enter a room ID:</h1>
        <input
          type="text"
          placeholder="Room ID"
          value={roomIdInput}
          onChange={(e) => setRoomIdInput(e.target.value)}
        />
        <button onClick={() => roomIdInput && router.push(`/chat?room=${roomIdInput}`)}>
          Join Room
        </button>
      </div>
    );

  return (
    <div className="page">
      <Head>
        <title>Chat</title>
        <meta name="og:title" content="Chat" />
        <meta name="og:description" content="Peer-to-peer chat interface with WebRTC" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <h1>Chat Room: {roomSlug}</h1>

      <input
        placeholder="Enter your name"
        value={yourName}
        onChange={(e) => setYourName(e.target.value)}
      />

      <h2>Peers</h2>
      <ul>
        {Object.entries(idsToNames).map(([id, name]) => (
          <li key={id}>
            {id}: {name?.toString() || 'Unknown'}
          </li>
        ))}
      </ul>

      <h2>Messages</h2>
      <MessageChat
        messages={messages}
        currentUserName={yourName}
        onSendMessage={broadcastMessage}
      />
    </div>
  );
};

export default Chat;
