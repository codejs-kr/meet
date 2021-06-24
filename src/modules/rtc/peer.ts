import EventEmitter from 'events';

class Peer extends EventEmitter {
  private localStream: any = null;

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

  getLocalStream() {
    return this.localStream;
  }
}

export default Peer;
