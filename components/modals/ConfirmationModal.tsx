
import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  isConfirming?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = 'Batal',
  confirmVariant = 'primary',
  isConfirming = false
}) => {
  const finalConfirmText = confirmText ?? (confirmVariant === 'danger' ? 'Hapus' : 'Konfirmasi');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="text-base text-gray-600 dark:text-gray-300">
          {message}
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isConfirming}>
            {cancelText}
          </Button>
          <Button type="button" variant={confirmVariant} onClick={onConfirm} disabled={isConfirming}>
            {isConfirming ? 'Memproses...' : finalConfirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
