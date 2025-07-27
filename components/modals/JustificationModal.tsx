
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
  const [minTasks, setMinTasks] = useState(0);
  const [maxTasks, setMaxTasks] = useState(0);
  const [score, setScore] = useState(0);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setRole(initialData.role);
      setMinTasks(initialData.min_tasks);
      setMaxTasks(initialData.max_tasks);
      setScore(initialData.score);
      setDescription(initialData.description);
    } else {
      setRole(ParticipantRole.FRONTEND);
      setMinTasks(0);
      setMaxTasks(0);
      setScore(0);
      setDescription('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({
      role,
      min_tasks: Number(minTasks),
      max_tasks: Number(maxTasks),
      score: Number(score),
      description,
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Justifikasi Task' : 'Tambah Justifikasi Task'}>
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
              label="Min Task Selesai"
              id="min-tasks"
              type="number"
              value={minTasks}
              onChange={(e) => setMinTasks(Number(e.target.value))}
              required
              min="0"
            />
            <Input
              label="Maks Task Selesai"
              id="max-tasks"
              type="number"
              value={maxTasks}
              onChange={(e) => setMaxTasks(Number(e.target.value))}
              required
              min="0"
            />
        </div>
        <Input
            label="Poin / Nilai"
            id="score"
            type="number"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            required
            min="0"
        />
        <Input
          label="Deskripsi"
          id="description"
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

export default JustificationModal;
