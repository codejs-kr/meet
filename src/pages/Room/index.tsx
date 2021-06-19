import React from 'react';
import { useParams } from 'react-router-dom';

interface PathParams {
  uuid: string;
}

const Room = () => {
  const { uuid } = useParams<PathParams>();
  return <div>Room, {uuid}</div>;
};

export default Room;
