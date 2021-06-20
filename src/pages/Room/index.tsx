import { useParams } from 'react-router-dom';
import PageTemplate from '../../components/layout/PageTemplate';

interface PathParams {
  uuid: string;
}

const Room = () => {
  const { uuid } = useParams<PathParams>();
  return <PageTemplate>Room, {uuid}</PageTemplate>;
};

export default Room;
