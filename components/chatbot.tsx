import React, { useState } from 'react';
import { Box, ScrollArea, Title, Text, Anchor, Center, Image, Flex } from '@mantine/core';
import { ChatInput } from './input';
import { Message } from './message';
import styles from '../styles/chatbot.module.css';


interface MessageType {
  message: string;
  sender: string;
  loading?: boolean; // Add a loading flag
}

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchResponse = async (prompt: string) => {
    try {
      const response = await fetch('localhost:8000', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data)
      return data.data[0].output;
    } catch (error) {
      console.error("Error fetching the API response.", error);
      return "Sorry, something went wrong.";
    }
  };

  const handleSendMessage = async (message: string) => {
    const userMessage = { message, sender: 'user' };
    setMessages([...messages, userMessage, { message: '', sender: 'bot', loading: true }]);
    setIsLoading(true);

    const lastSixMessages = [...messages.slice(-5), userMessage].map((msg) => msg.message).join('\n');
    const botResponse = await fetchResponse(lastSixMessages);

    setMessages((prev) =>
      prev.map((msg, index) =>
        index === prev.length - 1 ? { message: botResponse, sender: 'bot', loading: false } : msg
      )
    );
    setIsLoading(false);
  };

  return (
    <Box className={styles.chatbot}>
      <ScrollArea className={styles.messages}>
        {messages.length === 0 ? (
          <Center style={{ height: '70vh' }}>
            <Flex justify="center" align="center" direction="column">
              <Image src="logo.png" w={80} h={80} />
              <Title order={1} mt="md">SparkSDK</Title>
              <Text c="dimmed">
                Chat with <Anchor target="_blank"> Document AI </Anchor> here.
              </Text>
            </Flex>
          </Center>
        ) : (
          <Box className={styles.messageBox}>
            {messages.map((msg, index) => (
              <div key={index} className={styles.messageContainer}>
                <Message message={msg.message} sender={msg.sender} isLoading={msg.loading && isLoading || false} />
              </div>
            ))}
          </Box>
        )}
      </ScrollArea>
      <Box p="sm">
        <ChatInput onSendMessage={handleSendMessage} />
      </Box>
    </Box>
  );
};
