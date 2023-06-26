import React from 'react';
import {
  Container,
  Box,
  Text,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';
import { useEffect } from 'react';
import { useHistory } from 'react-router';

const HomePage = function () {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));

    if (user) history.push('/chats');
  }, [history]);

  return (
    <Container
      maxW="xl"
      centerContent>
      <Box
        d="flex"
        justifyContent={'center'}
        p={3}
        bg={'white'}
        w={'100%'}
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px">
        <Text
          d="flex"
          justifyContent={'center'}
          fontSize={'2xl'}
          fontFamily={'work sans'}
          color={'black'}>
          TALKATIVE
        </Text>
      </Box>

      <Box
        p={5}
        w={'100%'}
        bg={'white'}
        borderRadius={'lg'}
        borderWidth={'1px'}>
        <Tabs variant="soft-rounded">
          <TabList>
            <Tab width={'50%'}>Login</Tab>
            <Tab width={'50%'}>Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
