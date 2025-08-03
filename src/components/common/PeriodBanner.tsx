// src/components/common/PeriodBanner.tsx
"use client";

import React from 'react';
import { AlertTriangle, Calendar, CheckCircle } from 'lucide-react';

interface Period {
    start: string;
    end: string;
}

interface PeriodBannerProps {
    period: Period;
    periodStatus: 'upcoming' | 'open' | 'closed';
    openText: string;
    closedText: string;
    upcomingText: string;
}

const PeriodBanner: React.FC<PeriodBannerProps> = ({ period, periodStatus, openText, closedText, upcomingText }) => {
    if (!period?.start || !period?.end) {
        return (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md mb-6" role="alert">
                <p className="font-bold">{openText}</p>
                <p>Admin belum menetapkan batas waktu.</p>
            </div>
        );
    }

    const formattedStart = new Date(period.start).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const formattedEnd = new Date(period.end).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const statusConfig = {
        open: {
            bgColor: 'bg-green-100',
            borderColor: 'border-green-500',
            textColor: 'text-green-800',
            Icon: CheckCircle,
            title: openText,
        },
        closed: {
            bgColor: 'bg-red-100',
            borderColor: 'border-red-500',
            textColor: 'text-red-800',
            Icon: AlertTriangle,
            title: closedText,
        },
        upcoming: {
            bgColor: 'bg-yellow-100',
            borderColor: 'border-yellow-500',
            textColor: 'text-yellow-800',
            Icon: Calendar,
            title: upcomingText,
        }
    };

    const config = statusConfig[periodStatus];

    return (
        <div className={`${config.bgColor} ${config.borderColor} ${config.textColor} border-l-4 p-4 rounded-md mb-6`} role="alert">
            <div className="flex">
                <div className="py-1">
                    <config.Icon className="h-6 w-6 mr-4" />
                </div>
                <div>
                    <p className="font-bold">{config.title}</p>
                    <p className="text-sm">Jadwal: <strong>{formattedStart}</strong> - <strong>{formattedEnd}</strong></p>
                </div>
            </div>
        </div>
    );
};

export default PeriodBanner;