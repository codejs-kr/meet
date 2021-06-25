import { useCallback, useEffect, useRef, useMemo } from 'react';
import { Flex, Box, Input, Button } from '@chakra-ui/react';

import { useSelector, useDispatch } from 'react-redux';
import { Dispatch, select } from '../store';
import { peer } from '../modules/rtc';
import { getUuid } from '../modules/utils';
import socket from '../modules/socket';

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

const GateContainer = ({ roomId }: { roomId: string }) => {
  const { isConnectedSocket } = useSelector(select.room.state);
  const dispatch = useDispatch<Dispatch>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEnterRoom = useCallback(() => {
    const userInfo = {
      userId: getUuid(),
      nickName: inputRef.current?.value,
      profileImg: 'profileImg',
    };

    socket.emit('enter', roomId, userInfo);
    dispatch.room.setUserInfo(userInfo);
    dispatch.room.updateEnteredRoomState(true);
  }, [dispatch, roomId, inputRef]);

  useEffect(() => {
    (async () => {
      if (!videoRef.current) {
        return;
      }

      // 4:3 160x120
      const stream = await peer.getUserMedia(MEDIA_CONSTRAINTS);
      videoRef.current.srcObject = stream;
    })();
  }, []);

  return (
    <Box flex="1" className="gate-container">
      <Flex h="90%" color="white" direction="column" justifyContent="center" alignItems="center">
        <Box w="260px" textAlign="center" color="facebook.900">
          <Box w="260px" h="195px" mb="5" textAlign="center" borderRadius="20%" overflow="hidden">
            <video autoPlay ref={videoRef} />
          </Box>
          <Input
            placeholder="닉네임을 입력해주세요!"
            maxLength={15}
            mb="4"
            defaultValue="이나영"
            textAlign="center"
            ref={inputRef}
          />
          <Button colorScheme="blue" w="100%" onClick={handleEnterRoom}>
            입장하기
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default GateContainer;
