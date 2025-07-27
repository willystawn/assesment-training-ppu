

import React, { useState, useEffect } from 'react';
import { MasterTask, MasterTaskData, ParticipantRole } from '../../types';
import { PARTICIPANT_ROLES } from '../../constants';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';

interface MasterTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MasterTaskData) => Promise<void>;
  initialData?: MasterTask | null;
}

const MasterTaskModal: React.FC<MasterTaskModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [dayNumber, setDayNumber] = useState(1);
  const [backlog, setBacklog] = useState('');
  const [userStory, setUserStory] = useState('');
  const [role, setRole] = useState<ParticipantRole>(ParticipantRole.FRONTEND);
  const [targetPoints, setTargetPoints] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setDayNumber(initialData.day_number);
      setBacklog(initialData.backlog);
      setUserStory(initialData.user_story);
      setRole(initialData.role);
      setTargetPoints(initialData.target_points);
    } else {
      setDayNumber(1);
      setBacklog('');
      setUserStory('');
      setRole(ParticipantRole.FRONTEND);
      setTargetPoints(0);
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await onSubmit({
      day_number: Number(dayNumber),
      backlog,
      user_story: userStory,
      role,
      target_points: Number(targetPoints),
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Master Task' : 'Tambah Master Task Baru'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Hari Ke-"
          id="day-number"
          type="number"
          value={dayNumber}
          onChange={(e) => setDayNumber(Number(e.target.value))}
          required
          min="1"
        />
        <Input
          label="Backlog"
          id="backlog"
          type="text"
          value={backlog}
          onChange={(e) => setBacklog(e.target.value)}
        />
        <Textarea
          label="User Story"
          id="user-story"
          value={userStory}
          onChange={(e) => setUserStory(e.target.value)}
          required
        />
        <Select
          label="Posisi"
          id="task-role"
          value={role}
          onChange={(e) => setRole(e.target.value as ParticipantRole)}
          required
        >
          {PARTICIPANT_ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </Select>
        <Input
          label="Target Poin"
          id="target-points"
          type="number"
          value={targetPoints}
          onChange={(e) => setTargetPoints(Number(e.target.value))}
          required
          min="0"
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

export default MasterTaskModal;