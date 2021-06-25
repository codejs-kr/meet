import { Link } from 'react-router-dom';
import { Box, Center, Button, VStack } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';

import './index.scss';

const Home = () => {
  return (
    <Center bg="tomato" h="100vh" color="white">
      <VStack>
        <Box w="300px" color="white" textAlign="center">
          <Heading mb={10} textAlign="center" fontSize={80}>
            picasso
          </Heading>
          <Link to="/room/abc">
            <Button w="80%" colorScheme="teal" variant="solid">
              Create
            </Button>
          </Link>
        </Box>
      </VStack>
    </Center>
  );
};

export default Home;
