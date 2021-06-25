export const RTCPeerConnection = window.RTCPeerConnection;
export const RTCSessionDescription = window.RTCSessionDescription;
export const RTCIceCandidate = window.RTCIceCandidate;
export const getDefaultIceServers = () => [
  {
    urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
  },
  {
    urls: ['turn:107.150.19.220:3478'],
    credential: 'turnserver',
    username: 'subrosa',
  },
];
