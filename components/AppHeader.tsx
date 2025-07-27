
import React from 'react';
import Button from './ui/Button';
import LogoutIcon from './icons/LogoutIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import CalendarDaysIcon from './icons/CalendarDaysIcon';
import BuildingLibraryIcon from './icons/BuildingLibraryIcon';
import ScaleIcon from './icons/ScaleIcon';
import { ViewName } from '../App';

interface AppHeaderProps {
    currentView: ViewName;
    onNavigate: (view: ViewName) => void;
    onLogout: () => void;
}

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <ChartBarIcon className="h-5 w-5" /> },
    { id: 'assessment', label: 'Penilaian Harian', icon: <CalendarDaysIcon className="h-5 w-5" /> },
    { id: 'management', label: 'Manajemen Data', icon: <BuildingLibraryIcon className="h-5 w-5" /> },
    { id: 'justification', label: 'Manajemen Justifikasi', icon: <ScaleIcon className="h-5 w-5" /> }
];

const AppHeader: React.FC<AppHeaderProps> = ({ currentView, onNavigate, onLogout }) => {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
           <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="flex justify-between items-center py-3">
                 <div className="flex justify-start lg:w-0 lg:flex-1">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">Aplikasi Penilaian Training</h1>
                 </div>
                 <div className="flex items-center">
                    <Button onClick={onLogout} variant="secondary" size="sm" aria-label="Logout">
                       <LogoutIcon className="h-5 w-5" />
                       <span className="hidden sm:inline ml-2">Logout</span>
                    </Button>
                 </div>
             </div>
             <nav className="flex space-x-2 border-t border-gray-200 dark:border-gray-700 -mb-px overflow-x-auto">
               {navItems.map(item => (
                 <button
                   key={item.id}
                   onClick={() => onNavigate(item.id as ViewName)}
                   className={`flex items-center flex-shrink-0 px-3 py-3 font-medium text-sm border-b-2 ${
                     currentView === item.id
                       ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                   } transition-colors duration-200 ease-in-out focus:outline-none`}
                   aria-current={currentView === item.id ? 'page' : undefined}
                 >
                   {item.icon}
                   <span className="ml-2 whitespace-nowrap">{item.label}</span>
                 </button>
               ))}
             </nav>
           </div>
         </header>
    );
};

export default AppHeader;
