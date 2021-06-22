import io from 'socket.io-client';

// const SOCKET_SERVER = 'https://webrtclab.herokuapp.com';
const SOCKET_SERVER = 'http://localhost:3000';

const socket = io(SOCKET_SERVER);

export default socket;
