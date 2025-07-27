
import React, { useMemo } from 'react';
import { LeaderboardEntry } from '../../types';
import Card from '../ui/Card';
import UserGroupIcon from '../icons/UserGroupIcon';
import ChartBarIcon from '../icons/ChartBarIcon';
import StarIcon from '../icons/StarIcon';

interface StatCardsProps {
    leaderboard: LeaderboardEntry[];
    participantCount: number;
}

const StatCards: React.FC<StatCardsProps> = ({ leaderboard, participantCount }) => {
    const dashboardStats = useMemo(() => {
        if (!leaderboard || leaderboard.length === 0) {
            return {
                averageScore: 0,
                topPerformer: null,
            };
        }
        const averageScore = Math.round(leaderboard.reduce((sum, p) => sum + p.finalGrade, 0) / leaderboard.length);
        const topPerformer = leaderboard[0];
        return { averageScore, topPerformer };
    }, [leaderboard]);
    
    if (leaderboard.length === 0) {
        return null;
    }

    return (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-4 flex items-center">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                    <UserGroupIcon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                    <p className="text-base font-medium text-gray-500 dark:text-gray-400">Total Peserta</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{participantCount}</p>
                </div>
            </Card>
            <Card className="p-4 flex items-center">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
                    <ChartBarIcon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                    <p className="text-base font-medium text-gray-500 dark:text-gray-400">Rata-rata Nilai</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{dashboardStats.averageScore}</p>
                </div>
            </Card>
             {dashboardStats.topPerformer && (
                <Card className="p-4 flex items-center">
                    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400">
                        <StarIcon className="h-6 w-6" />
                    </div>
                    <div className="ml-4 min-w-0">
                        <p className="text-base font-medium text-gray-500 dark:text-gray-400">Performa Terbaik</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">{dashboardStats.topPerformer.participantName}</p>
                        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Nilai: {dashboardStats.topPerformer.finalGrade}</p>
                    </div>
                </Card>
            )}
       </div>
    );
};

export default StatCards;
