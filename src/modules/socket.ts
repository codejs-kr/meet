import io from 'socket.io-client';
import { isNodeProdcution } from 'modules/env';

const SOCKET_SERVER = isNodeProdcution ? 'https://webrtclab.herokuapp.com' : 'http://localhost:3000';

const socket = io(SOCKET_SERVER);

let roomId: string | null = null;
let senderId: string | null = null;
let participants: any = null;

type SocketMessageTarget = 'all' | string;

export const sendMessage = ({ type, body, to = 'all' }: { type: string; body: any; to?: SocketMessageTarget }) => {
  const data = {
    roomId,
    senderId,
    to: to === 'all' ? to : findSocketId(to),
    type,
    body,
  };

  socket.send(data);
  console.log('sendMessage :>> ', data);
};

interface SocketInitData {
  roomId: string;
  userId: string;
}

export const setParticipants = (data: any) => {
  participants = data;
};

export const setupBaseInfo = ({ roomId: id, userId }: SocketInitData) => {
  roomId = id;
  senderId = userId;
};

const findSocketId = (userId: string) => {
  // TODO: 소켓 서버 자체 배열화 필요
  // return participants.find((data) => data.userId === userId);
  let socketId = null;
  if (participants) {
    Object.keys(participants).forEach((key) => {
      if (participants[key].userId === userId) {
        socketId = participants[key].socketId;
      }
    });
  }

  return socketId;
};

export default socket;
