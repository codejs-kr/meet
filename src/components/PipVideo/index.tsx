import { useEffect, useRef } from 'react';
import './index.scss';

interface Props {
  stream: any;
}

const PipVideo = ({ stream }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="pip-video">
      <video autoPlay ref={videoRef} />
    </div>
  );
};

export default PipVideo;
