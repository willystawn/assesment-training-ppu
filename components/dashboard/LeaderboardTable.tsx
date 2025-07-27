import React, { useState, useMemo } from 'react';
import { LeaderboardEntry } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Pagination from '../ui/Pagination';
import TableCellsIcon from '../icons/TableCellsIcon';
import Avatar from '../common/Avatar';
import { getGradeBadgeStyle } from '../reports/ReportShared';

const ITEMS_PER_PAGE = 10;

interface LeaderboardTableProps {
    leaderboard: LeaderboardEntry[];
    trainingName: string;
    onExport: () => void;
    isExporting: boolean;
    canExport: boolean;
    onSelectParticipant: (entry: LeaderboardEntry) => void;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
    leaderboard,
    trainingName,
    onExport,
    isExporting,
    canExport,
    onSelectParticipant
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    const paginatedLeaderboard = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return leaderboard.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [leaderboard, currentPage]);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [leaderboard]);

    return (
        <Card>
            <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Leaderboard: {trainingName}</h2>
                <Button onClick={onExport} disabled={!canExport || isExporting} variant="secondary" size="sm">
                    <TableCellsIcon className="h-5 w-5 mr-2" />
                    {isExporting ? 'Mengekspor...' : 'Export ke Excel'}
                </Button>
            </div>
            <div className="overflow-x-auto">
                {leaderboard.length > 0 ? (
                    <>
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                                    <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Peserta</th>
                                    <th scope="col" className="px-6 py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Poin Penyelesaian</th>
                                    <th scope="col" className="px-6 py-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Poin Ketepatan</th>
                                    <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nilai Akhir</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {paginatedLeaderboard.map((entry, index) => {
                                    const originalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
                                    return (
                                        <tr key={entry.participantId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-center">
                                                <span className={`h-8 w-8 inline-flex items-center justify-center rounded-full font-semibold ${originalIndex < 3 ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                    {originalIndex + 1}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-base font-medium">
                                                <div className="flex items-center space-x-4">
                                                    <Avatar name={entry.participantName} />
                                                    <button onClick={() => onSelectParticipant(entry)} className="text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline">
                                                        {entry.participantName}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-base text-center text-gray-500 dark:text-gray-400">{entry.taskCompletionScore}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-base text-center text-gray-500 dark:text-gray-400">{entry.onTimeScore}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-base">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-base font-semibold ${getGradeBadgeStyle(entry.description)}`}>
                                                    <span className="font-bold mr-2">{entry.finalGrade}</span>
                                                    {entry.description}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        <Pagination
                            currentPage={currentPage}
                            totalItems={leaderboard.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={setCurrentPage}
                            className="p-4 border-t dark:border-gray-700"
                        />
                    </>
                ) : (
                    <p className="p-6 text-center text-gray-500 dark:text-gray-400">Tidak ada data peserta untuk ditampilkan. Pastikan justifikasi sudah diatur.</p>
                )}
            </div>
        </Card>
    );
};

export default LeaderboardTable;