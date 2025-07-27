
import React, { useState, useMemo } from 'react';
import { DetailedTask } from '../../types';
import { getBacklogColor } from '../../utils/colors';
import { statusStyles } from './ReportShared';
import Pagination from '../ui/Pagination';

const ITEMS_PER_PAGE = 10;

interface TaskDetailTableProps {
    tasks: DetailedTask[];
}

const TaskDetailTable: React.FC<TaskDetailTableProps> = ({ tasks }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const paginatedTasks = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return tasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [tasks, currentPage]);
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <h3 className="text-xl font-semibold p-5 border-b border-gray-200 dark:border-gray-700">Rincian Pengerjaan Task</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hari</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User Story</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Target Poin</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tgl. Selesai</th>
                        </tr>
                    </thead>
                     <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        {paginatedTasks.length > 0 ? paginatedTasks.map(task => (
                            <tr key={task.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-800 dark:text-gray-200">{task.day_number}</td>
                                <td className="px-6 py-4 text-sm">
                                    <p className="font-medium text-gray-900 dark:text-gray-100">{task.user_story}</p>
                                    {task.backlog && 
                                        <span className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBacklogColor(task.backlog)}`}>
                                            {task.backlog}
                                        </span>
                                    }
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-700 dark:text-gray-300">{task.target_points}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    <span className={`inline-flex items-center gap-x-1.5 px-2 py-1 text-xs font-medium rounded-full ${statusStyles[task.status].bg} ${statusStyles[task.status].color}`}>
                                         {React.cloneElement(statusStyles[task.status].icon, { className: "h-4 w-4"})}
                                        {statusStyles[task.status].text}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {task.completionDate ? new Date(task.completionDate).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'}) : '-'}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                                    Tidak ada task yang ditugaskan untuk peserta ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
             {tasks.length > ITEMS_PER_PAGE && (
                <Pagination
                    currentPage={currentPage}
                    totalItems={tasks.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                    className="p-4 border-t dark:border-gray-700"
                />
            )}
        </div>
    );
};

export default TaskDetailTable;
