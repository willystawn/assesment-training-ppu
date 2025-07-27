
import React from 'react';
import { DetailedTask } from '../../types';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import ClockIcon from '../icons/ClockIcon';
import XCircleIcon from '../icons/XCircleIcon';

export const getGradeColor = (description: string): string => {
    if (!description) return 'text-gray-700 dark:text-gray-300';
    const desc = description.toLowerCase();
    if (desc.includes('sangat baik')) return 'text-green-500 dark:text-green-400';
    if (desc.includes('baik')) return 'text-blue-500 dark:text-blue-400';
    if (desc.includes('cukup')) return 'text-yellow-500 dark:text-yellow-400';
    // Check for 'sangat kurang' first because it also contains 'kurang'
    if (desc.includes('sangat kurang')) return 'text-red-500 dark:text-red-400';
    if (desc.includes('kurang')) return 'text-orange-500 dark:text-orange-400'; // Warning color
    return 'text-gray-700 dark:text-gray-300';
};

export const getGradeBadgeStyle = (description: string): string => {
    const desc = description.toLowerCase();
    if (desc.includes('sangat baik')) return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    if (desc.includes('baik')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
    if (desc.includes('cukup')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    // Check for 'sangat kurang' first because it also contains 'kurang'
    if (desc.includes('sangat kurang')) return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    if (desc.includes('kurang')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'; // Warning color
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

export const statusStyles: { [key in DetailedTask['status']]: { icon: React.ReactElement<{ className?: string }>, text: string, color: string, bg: string } } = {
    'Tepat Waktu': { icon: <CheckCircleIcon />, text: 'Tepat Waktu', color: 'text-green-800 dark:text-green-300', bg: 'bg-green-100 dark:bg-green-900/50' },
    'Terlambat': { icon: <ClockIcon />, text: 'Terlambat', color: 'text-yellow-800 dark:text-yellow-300', bg: 'bg-yellow-100 dark:bg-yellow-900/50' },
    'Belum Selesai': { icon: <XCircleIcon />, text: 'Belum Selesai', color: 'text-red-800 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-900/50' },
};
