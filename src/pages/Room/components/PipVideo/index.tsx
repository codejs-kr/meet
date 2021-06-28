import { useEffect, useRef } from 'react';
import { Box, Flex, Avatar, IconButton, Icon } from '@chakra-ui/react';
import { IoMdMicOff } from 'react-icons/io';
import './index.scss';

interface Props {
  stream: any;
  videoEnabled: boolean;
  audioEnabled: boolean;
  nickName: string;
}

const PROFILE_URL = 'https://i.pinimg.com/originals/51/8f/df/518fdfc4f597e9c8efca678502a6c041.gif';

const PipVideo = ({ stream, videoEnabled, audioEnabled, nickName }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="pip-video">
      <video autoPlay ref={videoRef} />

      <Box className="nickname" as="span" borderRadius="md" bg="rgba(0,0,0,0.3)" color="white" px={2} minWidth="50px">
        {nickName}
      </Box>

      {!videoEnabled && (
        <Flex className="video-off-visual" w="100%" h="100%" justifyContent="center" alignItems="center">
          <Avatar src={PROFILE_URL} size="xl" />
        </Flex>
      )}

      {!audioEnabled && (
        <IconButton
          className="audio-off-icon"
          borderRadius="5px"
          colorScheme="yellow"
          aria-label="button"
          fontSize="24px"
          disabled
          icon={<Icon as={IoMdMicOff} />}
        />
      )}
    </div>
  );
};

export default PipVideo;
