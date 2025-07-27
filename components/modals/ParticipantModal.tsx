
import React, { useState, useEffect } from 'react';
import { Participant, ParticipantData, ParticipantRole } from '../../types';
import { PARTICIPANT_ROLES } from '../../constants';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface ParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ParticipantData) => Promise<void>;
  trainingId: string;
  initialData?: Participant | null;
}

const ParticipantModal: React.FC<ParticipantModalProps> = ({ isOpen, onClose, onSubmit, trainingId, initialData }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<ParticipantRole>(ParticipantRole.FRONTEND);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRole(initialData.role);
    } else {
      setName('');
      setRole(ParticipantRole.FRONTEND);
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({ name, role, training_id: trainingId });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Peserta' : 'Tambah Peserta Baru'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nama Peserta"
          id="participant-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Select
          label="Posisi"
          id="participant-role"
          value={role}
          onChange={(e) => setRole(e.target.value as ParticipantRole)}
          required
        >
          {PARTICIPANT_ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </Select>
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

export default ParticipantModal;
