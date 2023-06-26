import {
  Tooltip,
  Box,
  Button,
  Text,
  Menu,
  MenuButton,
  Avatar,
  MenuItem,
  MenuList,
  MenuDivider,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  useDisclosure,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon, SearchIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import ChatLoading from '../ChatLoading';
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';

function SideDrawer() {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const toast = useToast();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    history.push('/');
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please Enter something in search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      console.log(`${user.token}`);

      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
      console.log(data);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the Search Results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/chat`,
        { userId },
        config
      );

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: 'Error fetching the chat',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px">
        <Tooltip
          label="search"
          placement="bottom-end">
          <Button
            variant="ghost"
            onClick={onOpen}>
            <SearchIcon />
            <Text
              d={{ base: 'none', md: 'flex' }}
              px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontSize="2xl"
          fontFamily="Work sans">
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton>
              <BellIcon
                fontSize="2xl"
                m={1}
              />
            </MenuButton>
          </Menu>

          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                pic={user.pic}
              />
            </MenuButton>

            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      {/* SideDrawer */}
      <Drawer
        placement="left"
        onClose={onClose}
        isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
          <DrawerBody>
            <Box
              display="flex"
              pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && (
              <Spinner
                ml="auto"
                display="flex"
              />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
