import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch, select } from '../store';

import socket, { setupBaseInfo, setParticipants } from '../modules/socket';
import event from '../modules/event';

const SocketContainer = ({ roomId }: { roomId: string }) => {
  const { userInfo } = useSelector(select.room.state);
  const dispatch = useDispatch<Dispatch>();

  const onGateIn = useCallback(
    (roomId: string, info: any) => {
      console.log('gate', roomId, info);
      dispatch.room.updateSocketConnectionState(true);
      dispatch.room.updateParticipants(info.participants);
    },
    [dispatch]
  );

  const onJoinUser = useCallback((roomId, data) => {
    console.log('onJoinUser', roomId, data);
    setParticipants(data.participants);
    event.emit('join', data);
  }, []);

  const onLeaveUser = useCallback((data) => {
    console.log('onLeaveUser', data);
    event.emit('leave', data);
  }, []);

  const onMessage = useCallback((message: { type: string }) => {
    console.log('onMessage', message);
    event.emit(message.type, message);
  }, []);

  const bindSocket = useCallback(() => {
    socket.emit('gate', roomId);
    socket.on('gate', onGateIn);
    socket.on('join', onJoinUser);
    socket.on('leave', onLeaveUser);
    socket.on('message', onMessage);
  }, [roomId, onGateIn, onJoinUser, onLeaveUser, onMessage]);

  useEffect(() => {
    if (!userInfo) {
      return;
    }

    setupBaseInfo({
      roomId,
      userId: userInfo.userId,
    });
  }, [userInfo]);

  useEffect(() => {
    bindSocket();
  }, [bindSocket]);

  return null;
};

export default SocketContainer;
