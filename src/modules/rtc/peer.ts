import EventEmitter from 'events';
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, getDefaultIceServers } from './helpers';
import { sendMessage } from './../socket';

interface ConnectionInfo {
  targetUserId: string;
  type: string;
}

interface Peer extends ConnectionInfo {
  pc: any;
}

class Peer extends EventEmitter {
  private localStream: any = null;
  private peers: Peer[] = [];
  private peerConnectionOptions: any = getDefaultIceServers();

  /**
   * 미디어 접근 후 커넥션 요청
   */
  async getUserMedia(constraints: any) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      return new Promise((_, reject) => reject(error));
    }

    return this.localStream;
  }

  /**
   * 커넥션 오퍼 전송을 시작을 합니다.
   */
  startRtcConnection({ targetUserId, type }: ConnectionInfo) {
    const peer: Peer = this.createPeerConnection({ targetUserId, type });
    this.createOffer(peer);
  }

  /**
   * 피어 커넥션을 생성 합니다.
   */
  createPeerConnection({ targetUserId, type }: ConnectionInfo) {
    console.log('[peer] createPeerConnection :>> ', targetUserId, type);

    let peer = {
      targetUserId,
      type,
      pc: null,
    } as Peer;

    peer.pc = new RTCPeerConnection(this.peerConnectionOptions);
    console.log('[peer] new peer ', peer);

    peer.pc.onicecandidate = (event: any) => {
      if (event.candidate) {
        sendMessage({
          to: targetUserId,
          message: {
            type: 'signaling',
            body: {
              label: event.candidate.sdpMLineIndex,
              id: event.candidate.sdpMid,
              candidate: event.candidate.candidate,
            },
          },
        });
      } else {
        console.info('[peer] candidate denied', event.candidate);
      }
    };

    /**
     * 크로스브라우징
     */
    if (peer.pc.ontrack) {
      peer.pc.ontrack = (event: any) => {
        console.log('ontrack', event);
        const stream = event.streams[0];
        this.emit('addRemoteStream', {
          userId: peer.targetUserId,
          stream: stream,
        });
      };

      peer.pc.onremovetrack = (event: any) => {
        console.log('onremovetrack', event);
        const stream = event.streams[0];
        this.emit('removeRemoteStream', {
          userId: peer.targetUserId,
          stream: stream,
        });
      };
      // 삼성 모바일에서 필요
    } else {
      peer.pc.onaddstream = (event: any) => {
        console.log('onaddstream', event);
        this.emit('addRemoteStream', {
          userId: peer.targetUserId,
          stream: event.stream,
        });
      };

      peer.pc.onremovestream = (event: any) => {
        console.log('onremovestream', event);
        this.emit('removeRemoteStream', {
          userId: peer.targetUserId,
          stream: event.stream,
        });
      };
    }

    // peer.pc.onnegotiationneeded = (event: any) => {
    //   console.log('onnegotiationneeded', event);
    // };

    // peer.pc.onsignalingstatechange = (event: any) => {
    //   console.log('onsignalingstatechange', event);
    // };

    peer.pc.oniceconnectionstatechange = (event: any) => {
      console.log(
        'oniceconnectionstatechange',
        `iceGatheringState: ${peer.pc.iceGatheringState} / iceConnectionState: ${peer.pc.iceConnectionState}`
      );

      this.emit('iceConnectionStateChange', event);
    };

    this.peers.push(peer);

    return peer;
  }

  /**
   * offer SDP를 생성 한다.
   */
  createOffer(peer: Peer) {
    console.log('[peer] createOffer', peer);

    if (this.localStream) {
      this.addTrack(peer, this.localStream); // addTrack 제외시 recvonly로 SDP 생성됨
    }

    peer.pc
      .createOffer()
      .then((SDP: any) => {
        peer.pc.setLocalDescription(SDP);
        console.log('Sending offer description', SDP);

        sendMessage({
          to: peer.targetUserId,
          message: {
            type: 'signaling',
            body: {
              peerType: peer.type,
              sdp: SDP,
            },
          },
        });
      })
      .catch((error: Error) => {
        console.error('Error createOffer', error);
      });
  }

  createAnswer(peer: Peer, offerSdp: any) {
    console.log('[peer] createAnswer', peer, offerSdp);

    if (this.localStream) {
      this.addTrack(peer, this.localStream);
    }

    peer.pc
      .setRemoteDescription(new RTCSessionDescription(offerSdp))
      .then(() => {
        peer.pc
          .createAnswer()
          .then((SDP: any) => {
            peer.pc.setLocalDescription(SDP);
            console.log('Sending answer to peer.', SDP);

            sendMessage({
              to: peer.targetUserId,
              message: {
                type: 'signaling',
                body: {
                  peerType: peer.type,
                  sdp: SDP,
                },
              },
            });
          })
          .catch((error: Error) => {
            console.error('Error createAnswer', error);
          });
      })
      .catch((error: Error) => {
        console.error('Error setRemoteDescription', error);
      });
  }

  signaling(message: any) {
    console.log('[peer] signaling', message);

    const data = message.body;
    const sdp = data?.sdp;
    const candidate = data?.candidate;

    if (sdp) {
      // offer sdp에 대한 answer peer 생성
      if (sdp.type === 'offer') {
        const peer = this.createPeerConnection({
          targetUserId: message.senderId,
          type: data.peerType,
        });
        this.createAnswer(peer, sdp);

        // answer sdp 처리
      } else if (sdp.type === 'answer') {
        const peer = this.getPeer(message.senderId);
        peer?.pc.setRemoteDescription(new RTCSessionDescription(sdp));
      }

      // offer or answer cadidate처리
    } else if (candidate) {
      const peer = this.getPeer(message.senderId);
      const iceCandidate = new RTCIceCandidate({
        sdpMid: data.id,
        sdpMLineIndex: data.label,
        candidate: candidate,
      });

      peer?.pc.addIceCandidate(iceCandidate);
    }
  }

  addTrack(peer: Peer, stream: any) {
    if (peer.pc.addTrack) {
      stream.getTracks().forEach((track: any) => {
        peer.pc.addTrack(track, stream);
      });
    } else {
      peer.pc.addStream(stream);
    }
  }

  getPeer(targetUserId: string) {
    return this.peers.find((peer) => peer.targetUserId === targetUserId);
  }

  getLocalStream() {
    return this.localStream;
  }

  mute(type: 'video' | 'audio') {
    console.log('mute :>> ', type);

    if (type === 'video') {
      this.localStream.getVideoTracks()[0].enabled = false;
    } else {
      this.localStream.getAudioTracks()[0].enabled = false;
    }
  }

  unmute(type: 'video' | 'audio') {
    console.log('unmute :>> ', type);

    if (type === 'video') {
      this.localStream.getVideoTracks()[0].enabled = true;
    } else {
      this.localStream.getAudioTracks()[0].enabled = true;
    }
  }
}

export default Peer;
