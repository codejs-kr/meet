import { useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch, select } from 'store';
import { Flex, Box, Textarea, Button } from '@chakra-ui/react';
import { sendMessage } from 'modules/socket';
import event from 'modules/event';

import cn from 'classnames';

const ChatContainer = () => {
  const { chatList, userInfo, participants } = useSelector(select.room.state);
  const dispatch = useDispatch<Dispatch>();
  const listWrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const handleScrollToBottom = useCallback(() => {
    const $listWrap = listWrapRef.current;
    if (!$listWrap) {
      return;
    }

    $listWrap.scrollTop = $listWrap.scrollHeight;
  }, [listWrapRef]);

  const handleSendMessage = useCallback(() => {
    const message = textRef.current?.value;

    if (!textRef.current || !message) {
      return;
    }

    dispatch.room.addChat({
      isMine: true,
      nickName: userInfo.nickName,
      message,
    });

    sendMessage({
      type: 'chat',
      body: message,
    });

    textRef.current.value = '';
    setTimeout(() => handleScrollToBottom(), 0);
  }, [dispatch, userInfo.nickName, handleScrollToBottom]);

  const handleKeyUp = useCallback(
    (e) => {
      if (e.shiftKey) {
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  // NOTE: 한글 마지막 글자 두번 처리되는이슈로 keydown에서도 이벤트 핸들링 필요
  const handleKeyDown = useCallback((e) => {
    if (e.shiftKey) {
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }, []);

  const findParticipantInfo = useCallback(
    (userId: string) => {
      return participants.find((data) => data.userId === userId);
    },
    [participants]
  );

  useEffect(() => {
    event.on('chat', ({ senderId, body }) => {
      const nickName = findParticipantInfo(senderId)?.nickName ?? null;
      if (nickName) {
        dispatch.room.addChat({
          nickName,
          message: body,
        });
      }
    });
  }, [dispatch]);

  return (
    <Box margin="6px 6px 0 6px" bg="rgba(255,255,255,0.92)" color="#000" borderRadius="5px" boxShadow="10px">
      <Flex direction="column">
        <Box className="chat-list-wrap" padding="15px 12px 0 12px" ref={listWrapRef}>
          <ul>
            {chatList.map(({ isMine, nickName, message }, i) => (
              <li className={cn({ mine: isMine })} key={i}>
                <p className="nickname">{nickName}</p>
                <p className="body">{message}</p>
              </li>
            ))}
          </ul>
        </Box>
        <Box className="chat-input-wrap" bg="rgba(0,0,0,0.1)" padding="5px">
          <Flex h="100%" justifyContent="space-between">
            <Textarea
              placeholder="메시지를 입력해주세요!"
              background="#fff"
              resize="none"
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              ref={textRef}
            />
            <Button w="72px" h="100%" colorScheme="yellow" variant="solid" color="#fff" onClick={handleSendMessage}>
              Send
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default ChatContainer;
