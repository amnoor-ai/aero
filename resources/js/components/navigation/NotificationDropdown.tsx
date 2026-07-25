import { router } from '@inertiajs/react';
import {
    Bell,
    CheckCheck,
    CheckCircle2,
    Clock,
    FolderKanban,
    Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NotificationItem {
    id: string;
    title: string;
    description: string;
    time: string;
    type: 'task' | 'sprint' | 'milestone';
    read: boolean;
    link: string;
}

const initialNotifications: NotificationItem[] = [
    {
        id: '1',
        title: 'Task Assigned',
        description: 'You were assigned to "Fix OAuth Login & Session Persistence"',
        time: '15m ago',
        type: 'task',
        read: false,
        link: '/tasks',
    },
    {
        id: '2',
        title: 'Sprint Started',
        description: 'Sprint 15 - Navigation Shell has been launched in Aero',
        time: '2h ago',
        type: 'sprint',
        read: false,
        link: '/projects',
    },
    {
        id: '3',
        title: 'Milestone Updated',
        description: 'Target completion date updated for "Beta Release Gate"',
        time: '1d ago',
        type: 'milestone',
        read: true,
        link: '/milestones',
    },
];

export function NotificationDropdown() {
    const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleMarkAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const handleNotificationClick = (item: NotificationItem) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
        );
        router.visit(item.link);
    };

    const getIcon = (type: NotificationItem['type']) => {
        switch (type) {
            case 'task':
                return <CheckCircle2 className="w-4 h-4 text-primary" />;
            case 'sprint':
                return <Zap className="w-4 h-4 text-amber-500" />;
            case 'milestone':
                return <FolderKanban className="w-4 h-4 text-emerald-500" />;
            default:
                return <Bell className="w-4 h-4 text-primary" />;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="relative p-2 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-foreground transition cursor-pointer"
                    title="Notifications"
                >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground ring-2 ring-background animate-pulse">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl shadow-xl border border-border">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                    <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-foreground">Notifications</span>
                        {unreadCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                                {unreadCount} new
                            </span>
                        )}
                    </div>

                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="h-7 text-[10px] text-muted-foreground hover:text-foreground px-2"
                        >
                            <CheckCheck className="w-3 h-3 mr-1" />
                            Mark all read
                        </Button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="max-h-72 overflow-y-auto divide-y divide-border/60">
                    {notifications.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground text-xs">
                            No notifications right now.
                        </div>
                    ) : (
                        notifications.map((item) => (
                            <DropdownMenuItem
                                key={item.id}
                                onClick={() => handleNotificationClick(item)}
                                className={`flex items-start space-x-3 p-3 cursor-pointer transition focus:bg-muted/60 ${
                                    !item.read ? 'bg-primary/5' : ''
                                }`}
                            >
                                <div className="p-1.5 rounded-lg bg-card border border-border mt-0.5 flex-shrink-0">
                                    {getIcon(item.type)}
                                </div>
                                <div className="flex-1 space-y-0.5 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-xs font-semibold text-foreground truncate">
                                            {item.title}
                                        </h5>
                                        <span className="text-[10px] text-muted-foreground flex items-center flex-shrink-0">
                                            <Clock className="w-2.5 h-2.5 mr-0.5" />
                                            {item.time}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                                {!item.read && (
                                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                                )}
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
