
import React, { useState, useEffect } from 'react';
import { Training, TrainingData } from '../../types';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TrainingData) => Promise<void>;
  initialData?: Training | null;
}

const TrainingModal: React.FC<TrainingModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setStartDate(initialData.start_date);
      setEndDate(initialData.end_date);
    } else {
      setName('');
      setStartDate('');
      setEndDate('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({ name, start_date: startDate, end_date: endDate });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Batch Training' : 'Tambah Batch Baru'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nama Training"
          id="training-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Tanggal Mulai"
          id="start-date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <Input
          label="Tanggal Selesai"
          id="end-date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TrainingModal;
