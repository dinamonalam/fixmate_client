import React from 'react';
import { User } from 'lucide-react';

interface UserAvatarProps {
  name?: string;
  image?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function UserAvatar({
  name = 'User',
  image,
  size = 'md',
  className = '',
}: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-24 h-24 text-2xl',
  };

  const getInitials = (n: string) => {
    if (!n) return 'U';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  if (image && image.trim() !== '' && !image.includes('placeholder-undefined')) {
    return (
      <img
        src={image}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover shrink-0 ring-2 ring-blue-500/20 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center shrink-0 shadow-sm ${className}`}
      title={name}
    >
      {name && name.trim() ? getInitials(name) : <User className="w-1/2 h-1/2" />}
    </div>
  );
}
