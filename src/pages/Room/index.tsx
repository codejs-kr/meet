import { useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch, select } from 'store';
import { find } from 'lodash-es';

import socket, { sendMessage } from 'modules/socket';
import event from 'modules/event';
import { peer } from 'modules/rtc';

import { Flex, Box, HStack, Tooltip, IconButton, Icon, Grid } from '@chakra-ui/react';
import { PhoneIcon } from '@chakra-ui/icons';
import { IoMdMic, IoMdMicOff } from 'react-icons/io';
import { IoVideocam, IoVideocamOff } from 'react-icons/io5';
import PageTemplate from '../../components/layout/PageTemplate';
import SocketContainer from './containers/SocketContainer';
import GateContainer from './containers/GateContainer';
import ChatContainer from './containers/ChatContainer';

import PipVideo from './components/PipVideo';

import './index.scss';

interface PathParams {
  roomId: string;
}

const Room = () => {
  const { roomId } = useParams<PathParams>();
  const { isEnteredRoom, userInfo, participants, videos } = useSelector(select.room.state);
  const localVideoState = useSelector(select.room.localVideoState);
  const dispatch = useDispatch<Dispatch>();

  const handleCamera = useCallback(() => {
    if (!localVideoState) {
      return;
    }

    if (localVideoState.videoEnabled) {
      peer.mute('video');
      dispatch.room.updateVideoEnabled({
        userId: localVideoState.userId,
        enabled: false,
      });

      sendMessage({
        type: 'videoEnabled',
        body: false,
      });
    } else {
      peer.unmute('video');
      dispatch.room.updateVideoEnabled({
        userId: localVideoState.userId,
        enabled: true,
      });

      sendMessage({
        type: 'videoEnabled',
        body: true,
      });
    }
  }, [dispatch, localVideoState]);

  const handleMic = useCallback(() => {
    // do something
  }, [roomId]);

  const handleExit = useCallback(() => {
    if (window.confirm('미팅에서 나가겠습니까?')) {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    if (!userInfo) {
      return;
    }

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

    event.on('videoEnabled', ({ senderId, body }) => {
      console.log('videoEnabled :>> ', senderId, body);

      dispatch.room.updateVideoEnabled({
        userId: senderId,
        enabled: body,
      });
    });
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (isEnteredRoom && !videos.length) {
      dispatch.room.addVideo({
        userId: userInfo.userId,
        stream: peer.getLocalStream(),
        videoEnabled: true,
        audioEnabled: false,
      });
    }
  }, [dispatch, userInfo, isEnteredRoom, videos]);

  useEffect(() => {
    peer.on('addRemoteStream', (mediaInfo: { userId: string; stream: MediaStream }) => {
      dispatch.room.addVideo({
        ...mediaInfo,
        videoEnabled: true,
        audioEnabled: false,
      });
    });
  }, [dispatch]);

  const gridCount = useMemo(() => (participants.length >= 4 ? 4 : participants.length), [participants]);

  return (
    <PageTemplate id="room">
      <SocketContainer roomId={roomId} />

      {isEnteredRoom ? (
        <Flex h="100%" color="white" direction="column">
          <Box flex="2">
            <Flex h="100%" color="white" direction="row">
              <Box w="100%" padding="10px" bg="#202123">
                <Flex h="100%" alignItems="center" justifyContent="center">
                  <Grid templateColumns={`repeat(${gridCount}, 1fr)`} gap={3} alignItems="center">
                    {participants.map(({ userId, nickName }, i) => {
                      const mediaInfo = find(videos, { userId });
                      // TODO: mediaInfo 타입 처리 필요
                      return (
                        <PipVideo
                          stream={mediaInfo?.stream}
                          videoEnabled={!!mediaInfo?.videoEnabled}
                          audioEnabled={!!mediaInfo?.audioEnabled}
                          nickName={nickName}
                          key={i}
                        />
                      );
                    })}
                  </Grid>
                </Flex>
              </Box>
              <Box w="450px" h="100%" bg="#202123">
                <ChatContainer />
              </Box>
            </Flex>
          </Box>

          <Box h="80px" bg="black">
            <Flex h="100%" color="white" justifyContent="center" alignItems="center">
              <HStack spacing={4}>
                <Tooltip label="카메라" aria-label="카메라">
                  <IconButton
                    borderRadius="5px"
                    colorScheme="whiteAlpha"
                    aria-label="button"
                    fontSize="22px"
                    icon={localVideoState?.videoEnabled ? <Icon as={IoVideocam} /> : <Icon as={IoVideocamOff} />}
                    onClick={handleCamera}
                  />
                </Tooltip>
                <Tooltip label="마이크" aria-label="마이크">
                  <IconButton
                    borderRadius="5px"
                    colorScheme="whiteAlpha"
                    aria-label="button"
                    fontSize="22px"
                    // disabled
                    icon={localVideoState?.audioEnabled ? <Icon as={IoMdMic} /> : <Icon as={IoMdMicOff} />}
                    onClick={handleMic}
                  />
                </Tooltip>
                <Tooltip label="나가기" aria-label="나가기">
                  <IconButton
                    borderRadius="5px"
                    colorScheme="red"
                    aria-label="button"
                    icon={<PhoneIcon />}
                    onClick={handleExit}
                  />
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
