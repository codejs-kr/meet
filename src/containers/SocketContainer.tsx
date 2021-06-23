import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch, select } from '../store';

import socket, { setupBaseInfo, sendMessage } from '../modules/socket';
import event from '../modules/event';

const SocketContainer = ({ roomId }: { roomId: string }) => {
  const dispatch = useDispatch<Dispatch>();

  const onJoinUser = useCallback((roomId, data) => {
    console.log('onJoinUser', roomId, data);
    setupBaseInfo({
      roomId,
      userId: data.userInfo.userId,
    });
    event.emit('onJoinUser', data);
  }, []);

  const onLeaveUser = useCallback((data) => {
    console.log('onLeaveUser', data);
    event.emit('onLeaveUser', data);
  }, []);

  const onMessage = useCallback((message: { type: string }) => {
    console.log('onMessage', message);
    event.emit(message.type, message);
  }, []);

  const bindSocket = useCallback(() => {
    console.log('bindSocket');
    socket.emit('gate', roomId);

    socket.on('gate', (roomId: string, info: any) => {
      console.log('gate', roomId, info);
      dispatch.room.updateSocketConnectionState(true);
      dispatch.room.updateParticipants(info.participants);
    });
    socket.on('join', onJoinUser);
    socket.on('leave', onLeaveUser);
    socket.on('message', onMessage);
  }, [dispatch, roomId, onJoinUser, onLeaveUser, onMessage]);

  useEffect(() => {
    bindSocket();
  }, [bindSocket]);

  useEffect(() => {
    if (false) {
      socket.emit('enter', roomId, {
        nickName: '참여자a',
        profileImg: 'profileImg',
      });
    }
  }, [roomId]);

  return null;
};

export default SocketContainer;
