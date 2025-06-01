import React, { useState } from 'react';
import { Box, ScrollArea, Title, Text, Anchor, Center, Image, Flex, Paper, Stack, Group, Card, Badge } from '@mantine/core';
import { ChatInput } from './input';
import styles from '../styles/chatbot.module.css';
import {
  IconFileText,
  IconWorld
} from '@tabler/icons-react';
import ErrorModal from './errormodal'

interface AnalysisResponse {
  summary: string;
  nationalities: string[];
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export const Chatbot: React.FC = () => {
  const [output, setOutput] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('')
  const [modalOpened, setModalOpened] = useState(false);


  const fetchResponseWithFile = async (file: File): Promise<AnalysisResponse | string> => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `Error: ${response.status}`;
        
        try {
          const errorData: ErrorResponse = await response.json();
          errorMessage = errorData.error || errorMessage;
          if (errorData.details) {
            errorMessage += ` - ${errorData.details}`;
          }
        } catch {
          // If error response isn't JSON, use status text
          errorMessage = `Error: ${response.status} ${response.statusText}`;
        }
        
        // Set error state and return early
        setError(errorMessage);
        setModalOpened(true);
        return errorMessage; // or throw new Error(errorMessage) if you prefer
      }

      // If response is ok, parse the success response
      const data: AnalysisResponse = await response.json();
      
      // Clear any previous errors on success
      setError('');
      
      return data;

    } catch (error) {
      // Handle network errors or other exceptions
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred';
      
      setError(errorMessage);
      return errorMessage; // or throw error if you prefer
    }
  };

  // Function to analyze article with text input
  const fetchResponseWithText = async (text: string): Promise<AnalysisResponse | string> => {
    try {
      // Create FormData for text input
      const formData = new FormData();
      formData.append('text', text);
      // Convert to object for logging
      console.log('FormData as object:', Object.fromEntries(formData));

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `Error: ${response.status}`;
        try {
          const errorData: ErrorResponse = await response.json();
          errorMessage = errorData.error || errorMessage;
          if (errorData.details) {
            errorMessage += ` - ${errorData.details}`;
          }
        } catch {
          errorMessage = `Error: ${response.status} ${response.statusText}`;
          setError(errorMessage)
        }
        throw new Error(errorMessage);
      }

      const data: AnalysisResponse = await response.json();
      console.log(data)
      return data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sorry, something went wrong.";
      setError(errorMessage)
      return errorMessage;
    }
  };

  // Universal function that handles both file and text input
  const fetchResponse = async (input: File | string): Promise<AnalysisResponse | string> => {
    if (input instanceof File) {
      return fetchResponseWithFile(input);
    } else {
      return fetchResponseWithText(input);
    }
  };


  const handleSubmit = async (input: File | string) => {
    console.log(input)

    if (!input) return;

    setIsLoading(true);
    setError("");

    const response = await fetchResponse(input);
    console.log(response)

    if (typeof response === 'string') {
      setOutput(null);
    } else {
      setOutput(response);
      setError("");
    }

    setIsLoading(false);
  };

  return (
    <Box className={styles.chatbot} style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScrollArea style={{ flex: 1, padding: '1rem' }}>
        {!output ? (
          <Center style={{ height: '100%' }}>
            <Flex justify="center" align="center" direction="column">
              <Image src="logo.jpg" w={120} h={120} alt="Doc Analyzer Logo"/>
              <Title order={1} mt="md"> Document Analyzer </Title>
              <Text c="dimmed">
                Welcome to  <Anchor target="_blank"> Document Analyzer </Anchor>.
              </Text>
            </Flex>
          </Center>
        ) : (
        <Paper shadow="sm" p="xl" radius="md">
          <Stack gap="xl">
            <Group justify="space-between" align="center">
              <Title order={3} size="h4" c="green.6">
                📊 Analysis Results
              </Title>
              <Badge color="green" variant="light" size="lg">
                Complete
              </Badge>
            </Group>

            {/* Summary Card - Expanded */}
            <Card shadow="xs" padding="xl" radius="md" withBorder style={{ minHeight: '300px' }}>
              <Stack gap="md">
                <Group>
                  <IconFileText size="1.4rem" color="var(--mantine-color-blue-6)" />
                  <Text weight={600} size="xl" color="blue.6">
                    Summary
                  </Text>
                </Group>
                <Text size="lg" style={{ lineHeight: 1.8, padding: '1rem 0' }}>
                  {output.summary}
                </Text>
              </Stack>
            </Card>

            {/* Nationalities Card - Compact */}
            <Card shadow="xs" padding="lg" radius="md" withBorder>
              <Stack gap="sm">
                <Group>
                  <IconWorld size="1.2rem" color="var(--mantine-color-violet-6)" />
                  <Text weight={600} size="lg" color="violet.6">
                    Nationalities, Countries, People, Organizations Found
                  </Text>
                </Group>
                
                {output.nationalities.length > 0 ? (
                  <Group gap="xs">
                    {output.nationalities.map((nationality, index) => (
                      <Badge
                        key={index}
                        variant="gradient"
                        gradient={{ from: 'violet', to: 'blue' }}
                        size="md"
                      >
                        {nationality}
                      </Badge>
                    ))}
                  </Group>
                ) : (
                  <Text color="dimmed" size="sm" italic>
                    No nationalities or countries detected in this article
                  </Text>
                )}
              </Stack>
            </Card>

            {/* Stats */}
            <Group justify="center" gap="xl" mt="md">
              <div style={{ textAlign: 'center' }}>
                <Text size="xl" weight={700} color="blue.6">
                  {output.summary.split(' ').length}
                </Text>
                <Text size="xs" color="dimmed" transform="uppercase">
                  Summary Words
                </Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Text size="xl" weight={700} color="violet.6">
                  {output.nationalities.length}
                </Text>
                <Text size="xs" color="dimmed" transform="uppercase">
                  Nationalities Found
                </Text>
              </div>
            </Group>
          </Stack>
        </Paper>
      )}
      </ScrollArea>
      <Box p="xs" style={{ flexShrink: 0 }}>
        <ChatInput handleSubmit = {handleSubmit} loading={isLoading} error={error} />
      </Box>
            <ErrorModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        errorMessage={error}
      />
    </Box>
  );
};