import { Link } from 'react-router-dom';
import { Box, Center, Button, Input, Square, Circle, VStack, Stack } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';

import './index.scss';

const Home = () => {
  return (
    <div className="layout">
      <Center bg="tomato" h="100vh" color="white">
        <VStack>
          <Box bg="tomato" w="100%" color="white">
            <Heading mb={4}>picasso</Heading>
            <Stack direction="row" align="center">
              <Link to="/room/abc">
                <Button w="300px" colorScheme="teal" variant="solid">
                  Create
                </Button>
              </Link>
            </Stack>
          </Box>
        </VStack>
      </Center>
    </div>
  );
};

export default Home;
