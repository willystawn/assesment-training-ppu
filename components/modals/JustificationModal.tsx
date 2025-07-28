
import React, { useState, useEffect } from 'react';
import { Justification, JustificationData, ParticipantRole } from '../../types';
import { PARTICIPANT_ROLES } from '../../constants';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface JustificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JustificationData) => Promise<void>;
  initialData?: Justification | null;
}

const JustificationModal: React.FC<JustificationModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [role, setRole] = useState<ParticipantRole>(ParticipantRole.FRONTEND);
  const [rawScore, setRawScore] = useState(0);
  const [convertedScore, setConvertedScore] = useState(0);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setRole(initialData.role);
      setRawScore(initialData.min_tasks); // Use min_tasks as the raw score
      setConvertedScore(initialData.score);
      setDescription(initialData.description);
    } else {
      setRole(ParticipantRole.FRONTEND);
      setRawScore(0);
      setConvertedScore(0);
      setDescription('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({
      role,
      min_tasks: Number(rawScore),
      max_tasks: Number(rawScore), // Set max_tasks same as min_tasks for direct mapping
      score: Number(convertedScore),
      description,
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Aturan Konversi' : 'Tambah Aturan Konversi'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Posisi"
          id="justification-role"
          value={role}
          onChange={(e) => setRole(e.target.value as ParticipantRole)}
          required
        >
          {PARTICIPANT_ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </Select>
        <div className="grid grid-cols-2 gap-4">
            <Input
              label="Skor Mentah (Jml Task)"
              id="raw-score"
              type="number"
              value={rawScore}
              onChange={(e) => setRawScore(Number(e.target.value))}
              required
              min="0"
            />
            <Input
              label="Nilai Konversi"
              id="converted-score"
              type="number"
              value={convertedScore}
              onChange={(e) => setConvertedScore(Number(e.target.value))}
              required
              min="0"
            />
        </div>
        <Input
          label="Deskripsi / Kategori"
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="e.g. Sangat Baik, Baik, Kurang"
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

export default JustificationModal;
