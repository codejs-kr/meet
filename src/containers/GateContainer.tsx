import { useCallback, useEffect, useRef } from 'react';
import { Flex, Box, Input, Button } from '@chakra-ui/react';

import { useSelector, useDispatch } from 'react-redux';
import { Dispatch, select } from '../store';
import { peer } from '../modules/rtc';

const MEDIA_CONSTRAINTS = {
  audio: false,
  video: {
    width: {
      ideal: 160,
    },
    height: {
      ideal: 120,
    },
    frameRate: {
      ideal: 25,
    },
    // Select the front/user facing camera or the rear/environment facing camera if available (on Phone)
    facingMode: 'user',
  },
};

const GateContainer = () => {
  const { isConnectedSocket } = useSelector(select.room.state);
  const dispatch = useDispatch<Dispatch>();
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnterRoom = useCallback(() => {
    dispatch.room.updateEnteredRoomState(true);
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      if (!videoRef.current) {
        return;
      }

      // 4:3 160x120
      const stream = await peer.getUserMedia(MEDIA_CONSTRAINTS);
      videoRef.current.srcObject = stream;
    })();
  }, [videoRef]);

  return (
    <Box flex="1" className="gate-container">
      <Flex h="90%" color="white" direction="column" justifyContent="center" alignItems="center">
        <Box w="260px" textAlign="center" color="facebook.900">
          <Box w="260px" h="195px" mb="5" textAlign="center" borderRadius="20%" overflow="hidden">
            <video autoPlay ref={videoRef} />
          </Box>
          <Input placeholder="닉네임을 입력해주세요!" maxLength={15} mb="4" defaultValue="이나영" textAlign="center" />
          <Button colorScheme="blue" w="100%" onClick={handleEnterRoom}>
            입장하기
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default GateContainer;
