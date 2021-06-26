import { useCallback, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import socket from '../../modules/socket';
import event from '../../modules/event';

import {
  Flex,
  Box,
  HStack,
  Text,
  Tooltip,
  IconButton,
  Icon,
  Center,
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
import SocketContainer from '../../containers/SocketContainer';
import GateContainer from '../../containers/GateContainer';

import PipVideo from '../../components/PipVideo';

import { useSelector, useDispatch } from 'react-redux';
import { Dispatch, select } from '../../store';
import { peer } from '../../modules/rtc';

import './index.scss';

interface PathParams {
  roomId: string;
}

const Room = () => {
  const { roomId } = useParams<PathParams>();
  const history = useHistory();

  const { isEnteredRoom, isConnectedSocket, userInfo, remoteVideos } = useSelector(select.room.state);
  const dispatch = useDispatch<Dispatch>();

  const handleCamera = useCallback(() => {
    alert('handleCamera');
  }, []);

  const handleMic = useCallback(() => {
    socket.send({
      roomId,
      senderId: 'abc',
      to: 'all',
      type: 'chat',
      data: 'message',
    });
  }, [roomId]);

  const handleExit = useCallback(() => {
    window.location.href = '/';
  }, []);

  useEffect(() => {
    if (!userInfo) {
      return;
    }

    event.on('chat', ({ data }) => {
      console.log('chat', data);
    });

    event.on('signaling', (data) => {
      if (userInfo.userId !== data.senderId) {
        peer.signaling(data);
      }
    });

    event.on('join', (data) => {
      const joinUserId = data.userInfo.userId;
      if (userInfo.userId !== joinUserId) {
        console.log('참여자 발견', data);

        peer.startRtcConnection({
          targetUserId: joinUserId,
          type: 'userMedia',
        });
      }
    });
  }, [userInfo]);

  useEffect(() => {
    peer.on('addRemoteStream', (stream: MediaStream) => {
      dispatch.room.addRemoteVideo(stream);
    });
  }, [dispatch]);

  return (
    <PageTemplate id="room">
      <SocketContainer roomId={roomId} />

      {isEnteredRoom ? (
        <Flex h="100%" color="white" direction="column">
          <Box flex="2" bg="blue.500">
            <Flex h="100%" color="white" direction="row">
              <Box w="100%" bg="blue.100">
                <Text>
                  Room, {roomId} <br />
                  isConnectedSocket: {isConnectedSocket ? 'true' : 'false'}
                </Text>

                <PipVideo stream={peer.getLocalStream()} />

                {remoteVideos.map((stream) => (
                  <PipVideo stream={stream} />
                ))}
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
      ) : (
        <Flex h="100%" color="white" direction="column">
          <GateContainer roomId={roomId} />
        </Flex>
      )}
    </PageTemplate>
  );
};

export default Room;
