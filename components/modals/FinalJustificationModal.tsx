
import React, { useState, useEffect } from 'react';
import { FinalJustification, FinalJustificationData } from '../../types';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface FinalJustificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FinalJustificationData) => Promise<void>;
  initialData?: FinalJustification | null;
}

const FinalJustificationModal: React.FC<FinalJustificationModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setMinScore(initialData.min_score);
      setMaxScore(initialData.max_score);
      setDescription(initialData.description);
    } else {
      setMinScore(0);
      setMaxScore(0);
      setDescription('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({
      min_score: Number(minScore),
      max_score: Number(maxScore),
      description,
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Justifikasi Akhir' : 'Tambah Justifikasi Akhir'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min Nilai Akhir"
              id="min-score"
              type="number"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              required
              min="0"
            />
            <Input
              label="Maks Nilai Akhir"
              id="max-score"
              type="number"
              value={maxScore}
              onChange={(e) => setMaxScore(Number(e.target.value))}
              required
              min="0"
            />
        </div>
        <Input
          label="Deskripsi"
          id="final-description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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

export default FinalJustificationModal;
