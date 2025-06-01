// components/Navbar.tsx
import React from 'react';
import { Button, Group, Box, Title } from '@mantine/core';
import { IconBrandGithub , IconRefresh} from '@tabler/icons-react';
import styles from '../styles/navbar.module.css';

export const Navbar: React.FC = () => {

  const handleRefresh = () => {
    window.location.reload();
  };
  return (
    <Box h={60} className={styles.navbar}>
      <Group className={styles.group}>
        <Title order={3}>Document Analyzer</Title>
        <Group>
            <Button
              onClick={handleRefresh}
              color="blue"
              leftSection={<IconRefresh />}
            >
              Refresh
          </Button>
          <Button
            component="a"
            href="https://github.com/simingg/nextjs-frontend-ai"
            target="_blank"
            rel="noopener noreferrer"
            color="dark"
            leftSection={<IconBrandGithub />}
          >
            Github
          </Button>
          <Button
            component="a"
            href="https://linkedin.com/in/simeng99"
            target="_blank"
            rel="noopener noreferrer"
          >
            About Me
          </Button>
        </Group>
      </Group>
    </Box>
  );
};
