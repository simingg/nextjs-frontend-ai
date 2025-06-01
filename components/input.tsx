// components/input.tsx
import React, { useState, KeyboardEvent } from 'react';
import { Textarea, Group, Paper, FileInput, Stack, Title, Text, Button, Divider } from '@mantine/core';
import { IconUpload, IconFileText } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import styles from '../styles/input.module.css';

interface ChatInputProps {
  handleSubmit: (input: File | string) => Promise<void>;
  loading: boolean;
  error: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ handleSubmit, loading }) => {
  const [textInput, setTextInput] = React.useState<string>("");
  const [file, setFile] = React.useState<File | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Clear the other input when one is selected
  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    if (selectedFile) {
      setTextInput(''); // Clear text input when file is selected
    }
  };

  const handleTextChange = (value: string) => {
    setTextInput(value);
    if (value.trim()) {
      setFile(null); // Clear file when text is entered
    }
  };

  const handleAnalyzeClick = () => {
    if (file) {
      handleSubmit(file);
    } else if (textInput.trim()) {
      handleSubmit(textInput);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (isMobile) {
      // Mobile: Enter key inserts a new line
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        setTextInput((prev) => prev + '\n');
      }
    } else {
      // Desktop: Shift + Enter inserts a new line, Enter sends message
      if (event.key === 'Enter') {
        if (event.shiftKey) {
          // Insert a new line
          setTextInput((prev) => prev + '\n');
        } else {
          // Send message
          event.preventDefault();
          handleAnalyzeClick();
        }
      }
    }
  };

  // Determine if analyze button should be enabled
  const canAnalyze = (file !== null) || (textInput.trim().length >= 50);

  return (
     <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Compact Input Section */}
      <Paper shadow="sm" p="md" radius="md" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack gap="md" style={{ height: '100%' }}>
          <Group justify="space-between" align="center">
            <Title order={4} size="h5">
              Choose Input Method
            </Title>
          </Group>

          <Group gap="md" style={{ height: '100%', alignItems: 'stretch' }}>
            <div style={{ flex: '0 0 20%', display: 'flex', flexDirection: 'column' }}>
              <Text weight={500} size="xs" mb="xs" color="dimmed">
                📁 Upload File
              </Text>
              <FileInput
                placeholder="Choose file"
                leftSection={<IconUpload size="0.9rem" />}
                accept=".txt,.docx"
                value={file}
                onChange={handleFileChange}
                disabled={loading || textInput.trim().length > 0} // Disabled when text is entered
                size="sm"
                variant="filled"
                clearable
              />
              <Text size="xs" color="dimmed" mt="xs">
                Accepts .txt, .docx
              </Text>
              {file && (
                <Text size="xs" color="green" mt="xs">
                  ✓ File selected: {file.name}
                </Text>
              )}
            </div>

            <Divider orientation="vertical" />

            <div style={{ flex: '0 0 75%', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Text weight={500} size="xs" mb="xs" color="dimmed">
                ✏️ Paste Text
              </Text>
              <div style={{ display: 'flex', height: '100%', gap: '0.5rem' }}>
                <Textarea
                  placeholder="Paste article content here."
                  value={textInput}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => handleTextChange(e.currentTarget.value)}
                  disabled={loading || file !== null} // Disabled when file is selected
                  size="sm"
                  variant="filled"
                  style={{ flex: 1, height: '100%' }}
                  styles={{
                    input: {
                      height: '100%',
                      minHeight: '200px'
                    }
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  {textInput.length > 0 && (
                    <Text size="xs" color={textInput.length < 50 ? "red" : "green"} style={{ textAlign: 'center' }}>
                      {textInput.length}/50
                    </Text>
                  )}
                </div>
              </div>
            </div>
          </Group>
          <Group gap="center">
            <Button
              lefticon={<IconFileText size="0.9rem" />}
              onClick={handleAnalyzeClick}
              disabled={loading || !canAnalyze}
              size="md"
              variant="filled"
            >
              {loading ? 'Analyzing...' : 'Submit'}
            </Button>
          </Group>
        </Stack>
      </Paper>
    </div>
  );
};