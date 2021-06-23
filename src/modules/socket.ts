import io from 'socket.io-client';

// const SOCKET_SERVER = 'https://webrtclab.herokuapp.com';
const SOCKET_SERVER = 'http://localhost:3000';

const socket = io(SOCKET_SERVER);

let roomId: string | null = null;
let senderId: string | null = null;

interface SocketMessage {
  type: string;
  data: any;
}

type SocketMessageTarget = 'all' | string;

export const sendMessage = (message: SocketMessage, to: SocketMessageTarget = 'all') => {
  socket.send({
    roomId,
    senderId,
    to,
    ...message,
  });
};

interface SocketInitData {
  roomId: string;
  userId: string;
}

export const setupBaseInfo = ({ roomId: id, userId }: SocketInitData) => {
  roomId = id;
  senderId = userId;
};

export default socket;
