import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Center, Button, VStack } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import { getRandomRoomId } from 'modules/utils';

import './index.scss';
import bgImage from 'assets/img/bg-home.png';

const Home = () => {
  const history = useHistory();
  const handleEnterRoom = useCallback(() => {
    const roomId = getRandomRoomId(3);
    history.push(`/room/${roomId}`);
  }, []);

  return (
    <Center h="80vh" color="white">
      <VStack>
        <Box w="500px" color="white" textAlign="center">
          <img src={bgImage} alt="화상회의 만들며 배우는 WebRTC" />
          <Heading mt={10} mb={10} textAlign="center" fontSize={40} color="#000">
            화상회의 만들며 배우는 WebRTC
          </Heading>

          <Button w="260px" colorScheme="yellow" size="lg" variant="solid" onClick={handleEnterRoom}>
            시작하기
          </Button>
        </Box>
      </VStack>
    </Center>
  );
};

export default Home;
