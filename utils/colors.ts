import { ParticipantRole } from '../types';

const backlogColorPalette = [
    { bg: 'bg-red-100', text: 'text-red-800', darkBg: 'dark:bg-red-900/50', darkText: 'dark:text-red-300' },
    { bg: 'bg-yellow-100', text: 'text-yellow-800', darkBg: 'dark:bg-yellow-900/50', darkText: 'dark:text-yellow-300' },
    { bg: 'bg-green-100', text: 'text-green-800', darkBg: 'dark:bg-green-900/50', darkText: 'dark:text-green-300' },
    { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'dark:bg-blue-900/50', darkText: 'dark:text-blue-300' },
    { bg: 'bg-indigo-100', text: 'text-indigo-800', darkBg: 'dark:bg-indigo-900/50', darkText: 'dark:text-indigo-300' },
    { bg: 'bg-purple-100', text: 'text-purple-800', darkBg: 'dark:bg-purple-900/50', darkText: 'dark:text-purple-300' },
    { bg: 'bg-pink-100', text: 'text-pink-800', darkBg: 'dark:bg-pink-900/50', darkText: 'dark:text-pink-300' },
    { bg: 'bg-teal-100', text: 'text-teal-800', darkBg: 'dark:bg-teal-900/50', darkText: 'dark:text-teal-300' },
    { bg: 'bg-orange-100', text: 'text-orange-800', darkBg: 'dark:bg-orange-900/50', darkText: 'dark:text-orange-300' },
];

const backlogColorCache = new Map<string, string>();

export const getBacklogColor = (backlogName: string): string => {
    if (!backlogName) {
        return '';
    }
    if (backlogColorCache.has(backlogName)) {
        return backlogColorCache.get(backlogName)!;
    }

    let hash = 0;
    for (let i = 0; i < backlogName.length; i++) {
        const char = backlogName.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; 
    }

    const index = Math.abs(hash) % backlogColorPalette.length;
    const color = backlogColorPalette[index];
    const colorClasses = `${color.bg} ${color.text} ${color.darkBg} ${color.darkText}`;
    
    backlogColorCache.set(backlogName, colorClasses);

    return colorClasses;
};


const roleColorPalette: { [key in ParticipantRole]: string } = {
  [ParticipantRole.FRONTEND]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300',
  [ParticipantRole.BACKEND]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
};

export const getRoleColor = (role: ParticipantRole): string => {
    return roleColorPalette[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};