import { useEffect, useRef } from 'react';
import './index.scss';

interface Props {
  stream: any;
  videoEnabled: boolean;
  audioEnabled: boolean;
}

const PipVideo = ({ stream, videoEnabled, audioEnabled }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="pip-video">
      <video autoPlay ref={videoRef} />
      {`videoEnabled: ${videoEnabled}`}
      {`audioEnabled: ${audioEnabled}`}
    </div>
  );
};

export default PipVideo;
