// components/ErrorModal.tsx
import { Modal, Text } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

type ErrorModalProps = {
  opened: boolean;
  onClose: () => void;
  errorMessage: string;
};

const ErrorModal = ({ opened, onClose, errorMessage }: ErrorModalProps) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-red-600">
          <IconAlertTriangle size={20} /> Error
        </div>
      }
      centered
      overlayProps={{
        blur: 3,
        opacity: 0.55,
      }}
    >
      <Text color="red.7" size="sm">
        {errorMessage}
      </Text>
    </Modal>
  );
};

export default ErrorModal;