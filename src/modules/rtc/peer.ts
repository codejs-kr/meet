import EventEmitter from 'events';
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, getDefaultIceServers } from './helpers';
import { sendMessage } from './../socket';

class Peer extends EventEmitter {
  private localStream: any = null;
  private peer: any = null;
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
  startRtcConnection() {
    this.peer = this.createPeerConnection();
    this.createOffer(this.peer);
  }

  createPeerConnection() {
    this.peer = new RTCPeerConnection(this.peerConnectionOptions);
    console.log('New peer ', this.peer);
    const peer = this.peer;

    peer.onicecandidate = (event: any) => {
      if (event.candidate) {
        sendMessage({
          to: 'all',
          message: {
            type: 'signaling',
            body: {
              label: event.candidate.sdpMLineIndex,
              id: event.candidate.sdpMid,
              candidate: event.candidate.candidate,
            },
          },
        });
        // send({
        //   to: 'all',
        //   label: event.candidate.sdpMLineIndex,
        //   id: event.candidate.sdpMid,
        //   candidate: event.candidate.candidate,
        // });
      } else {
        console.info('Candidate denied', event.candidate);
      }
    };

    /**
     * 크로스브라우징
     */
    if (peer.ontrack) {
      peer.ontrack = (event: any) => {
        console.log('ontrack', event);
        const stream = event.streams[0];
        this.emit('addRemoteStream', stream);
      };

      peer.onremovetrack = (event: any) => {
        console.log('onremovetrack', event);
        const stream = event.streams[0];
        this.emit('removeRemoteStream', stream);
      };
      // 삼성 모바일에서 필요
    } else {
      peer.onaddstream = (event: any) => {
        console.log('onaddstream', event);
        this.emit('addRemoteStream', event.stream);
      };

      peer.onremovestream = (event: any) => {
        console.log('onremovestream', event);
        this.emit('removeRemoteStream', event.stream);
      };
    }

    peer.oniceconnectionstatechange = (event: any) => {
      console.log(
        'oniceconnectionstatechange',
        `iceGatheringState: ${peer.iceGatheringState} / iceConnectionState: ${peer.iceConnectionState}`
      );

      this.emit('iceConnectionStateChange', event);
    };

    return peer;
  }

  /**
   * offer SDP를 생성 한다.
   */
  createOffer(peer: any) {
    console.log('createOffer', arguments);

    if (this.localStream) {
      this.addTrack(peer, this.localStream); // addTrack 제외시 recvonly로 SDP 생성됨
    }

    peer
      .createOffer()
      .then((SDP: any) => {
        peer.setLocalDescription(SDP);
        console.log('Sending offer description', SDP);

        sendMessage({
          to: 'all',
          message: {
            type: 'signaling',
            body: {
              sdp: SDP,
            },
          },
        });

        // send({
        //   to: 'all',
        //   sdp: SDP,
        // });
      })
      .catch((error: any) => {
        console.error('Error createOffer', error);
      });
  }

  createAnswer(peer: any, offerSdp: any) {
    console.log('createAnswer');

    if (this.localStream) {
      this.addTrack(peer, this.localStream);
    }

    peer
      .setRemoteDescription(new RTCSessionDescription(offerSdp))
      .then(() => {
        peer
          .createAnswer()
          .then((SDP: any) => {
            peer.setLocalDescription(SDP);
            console.log('Sending answer to peer.', SDP);

            sendMessage({
              to: 'all',
              message: {
                type: 'signaling',
                body: {
                  sdp: SDP,
                },
              },
            });

            // send({
            //   to: 'all',
            //   sdp: SDP,
            // });
          })
          .catch((error: any) => {
            console.error('Error createAnswer', error);
          });
      })
      .catch((error: any) => {
        console.error('Error setRemoteDescription', error);
      });
  }

  signaling(data: any) {
    console.log('signaling', data);

    const sdp = data?.sdp;
    const candidate = data?.candidate;

    // 접속자가 보내온 offer처리
    if (sdp) {
      if (sdp.type === 'offer') {
        this.peer = this.createPeerConnection();
        this.createAnswer(this.peer, sdp);

        // offer에 대한 응답 처리
      } else if (sdp.type === 'answer') {
        this.peer.setRemoteDescription(new RTCSessionDescription(sdp));
      }

      // offer or answer cadidate처리
    } else if (candidate) {
      const iceCandidate = new RTCIceCandidate({
        sdpMid: data.id,
        sdpMLineIndex: data.label,
        candidate: candidate,
      });

      this.peer.addIceCandidate(iceCandidate);
    }
  }

  addTrack(peer: any, stream: any) {
    if (peer.addTrack) {
      stream.getTracks().forEach((track: any) => {
        peer.addTrack(track, stream);
      });
    } else {
      peer.addStream(stream);
    }
  }

  getLocalStream() {
    return this.localStream;
  }
}

export default Peer;
