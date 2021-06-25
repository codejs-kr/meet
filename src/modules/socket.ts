import io from 'socket.io-client';

// const SOCKET_SERVER = 'https://webrtclab.herokuapp.com';
const SOCKET_SERVER = 'http://localhost:3000';

const socket = io(SOCKET_SERVER);

let roomId: string | null = null;
let senderId: string | null = null;

interface SocketMessage {
  type: string;
  body: any;
}

type SocketMessageTarget = 'all' | string;

export const sendMessage = ({ message, to = 'all' }: { message: SocketMessage; to?: SocketMessageTarget }) => {
  const data = {
    roomId,
    senderId,
    to,
    ...message,
  };

  socket.send(data);
  console.log('sendMessage :>> ', data);
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
