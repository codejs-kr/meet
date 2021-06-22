import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../../modules/socket';

import {
  Box,
  Tooltip,
  IconButton,
  Icon,
  Center,
  Flex,
  HStack,
  Text,
  Button,
  Input,
  Square,
  Circle,
  VStack,
  Stack,
} from '@chakra-ui/react';
import { PhoneIcon } from '@chakra-ui/icons';
import { IoMdMic, IoMdMicOff } from 'react-icons/io';
import { IoVideocam, IoVideocamOff } from 'react-icons/io5';
import PageTemplate from '../../components/layout/PageTemplate';
import './index.scss';

interface PathParams {
  uuid: string;
}

const Room = () => {
  const { uuid } = useParams<PathParams>();
  const isJoined = false;

  const handleCamera = useCallback(() => {
    alert('handleCamera');
  }, []);

  const handleMic = useCallback(() => {
    alert('handleMic');
  }, []);

  const handleExit = useCallback(() => {
    alert('handleExit');
  }, []);

  const bindSocket = useCallback(() => {
    socket.emit('gate', uuid);
    socket.on('gate', (data: any) => {
      console.log('gate', data);
    });

    socket.emit('enter', uuid, {
      nickName: '참여자a',
      profileImg: 'profileImg',
    });

    socket.on('join', (roomId: string, info: any) => {
      console.log('join', roomId, info);
    });
    // socket.on('leave', onLeave);
    // socket.on('message', onMessage);
  }, []);

  const init = useCallback(() => {
    bindSocket();
  }, [bindSocket]);

  useEffect(() => {
    init();
  }, []);

  return (
    <PageTemplate id="room">
      <Flex h="100%" color="white" direction="column">
        <Box flex="2" bg="blue.500">
          <Flex h="100%" color="white" direction="row">
            <Box w="100%" bg="blue.100">
              <Text>Room, {uuid}</Text>
            </Box>
            <Box w="450px" bg="blue.200">
              <Text>Chat</Text>
            </Box>
          </Flex>
        </Box>

        <Box h="80px" bg="black">
          <Flex h="100%" color="white" justifyContent="center" alignItems="center">
            <HStack spacing={4}>
              <Tooltip label="카메라" aria-label="카메라">
                <IconButton
                  colorScheme="whiteAlpha"
                  aria-label="button"
                  fontSize="22px"
                  icon={true ? <Icon as={IoVideocam} /> : <Icon as={IoVideocamOff} />}
                  onClick={handleCamera}
                />
              </Tooltip>
              <Tooltip label="마이크" aria-label="마이크">
                <IconButton
                  colorScheme="whiteAlpha"
                  aria-label="button"
                  fontSize="22px"
                  icon={true ? <Icon as={IoMdMic} /> : <Icon as={IoMdMicOff} />}
                  onClick={handleMic}
                />
              </Tooltip>
              <Tooltip label="나가기" aria-label="나가기">
                <IconButton colorScheme="red" aria-label="button" icon={<PhoneIcon />} onClick={handleExit} />
              </Tooltip>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </PageTemplate>
  );
};

export default Room;
