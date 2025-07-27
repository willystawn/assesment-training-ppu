
import React from 'react';

interface AvatarProps {
    name: string;
    size?: 'base' | 'lg';
}

const Avatar: React.FC<AvatarProps> = ({ name, size = 'base' }) => {
    const getInitials = (nameStr: string) => {
        if (!nameStr) return '';
        const parts = nameStr.split(' ');
        if (parts.length > 1 && parts[0] && parts[1]) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return nameStr.substring(0, 2).toUpperCase();
    };

    const colors = [
        'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 
        'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500', 'bg-orange-500'
    ];
    
    const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const colorIndex = charCodeSum % colors.length;
    const color = colors[colorIndex];

    const sizeClasses = {
        base: 'w-10 h-10 text-sm',
        lg: 'w-11 h-11 text-base',
    }

    return (
        <div className={`rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold ${color} ${sizeClasses[size]}`}>
            {getInitials(name)}
        </div>
    );
};

export default Avatar;
