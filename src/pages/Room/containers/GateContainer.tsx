import { useCallback, useEffect, useRef } from 'react';
import { Flex, Box, Input, Button } from '@chakra-ui/react';

import { useDispatch } from 'react-redux';
import { Dispatch, select } from 'store';
import { peer } from 'modules/rtc';
import { getUuid } from 'modules/utils';
import socket from 'modules/socket';

const MEDIA_CONSTRAINTS = {
  audio: false,
  video: {
    width: {
      ideal: 320,
      // ideal: 160,
    },
    height: {
      ideal: 240,
      // ideal: 120,
    },
    frameRate: {
      ideal: 25,
    },
    // Select the front/user facing camera or the rear/environment facing camera if available (on Phone)
    facingMode: 'user',
  },
};

const GateContainer = ({ roomId }: { roomId: string }) => {
  const dispatch = useDispatch<Dispatch>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEnterRoom = useCallback(() => {
    const nickName = inputRef.current?.value;
    if (!nickName) {
      alert('닉네임을 입력해주세요!');
      return;
    }

    const userInfo = {
      userId: getUuid(),
      nickName,
      profileImg: 'profileImg',
    };

    socket.emit('enter', roomId, userInfo);
    dispatch.room.setUserInfo(userInfo);
    dispatch.room.updateEnteredRoomState(true);
    window.localStorage.setItem('nickName', nickName);
  }, [dispatch, roomId, inputRef]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEnterRoom();
    }
  }, []);

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

  const defaultValue = window.localStorage.getItem('nickName') || '';

  return (
    <Box flex="1" className="gate-container">
      <Flex h="90%" color="white" direction="column" justifyContent="center" alignItems="center">
        <Box w="260px" textAlign="center" color="facebook.900">
          <Box w="260px" h="195px" mb="6" textAlign="center" borderRadius="25px" overflow="hidden">
            <video autoPlay ref={videoRef} />
          </Box>
          <Input
            placeholder="닉네임을 입력해주세요!"
            maxLength={15}
            mb="2"
            size="lg"
            defaultValue={defaultValue}
            textAlign="center"
            ref={inputRef}
            onKeyDown={handleKeyDown}
            required
          />
          <Button colorScheme="yellow" w="100%" size="lg" onClick={handleEnterRoom}>
            입장하기
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default GateContainer;
