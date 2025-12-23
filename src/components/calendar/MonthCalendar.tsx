import { useState } from 'react';
import { Record } from '@/types';
import { CalendarCell } from './CalendarCell';
import {
    startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, format, isSameDay, addMonths, subMonths
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthCalendarProps {
    records: Record[];
}

export const MonthCalendar = ({ records }: MonthCalendarProps) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const getRecordsForDate = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return records.filter(r => r.date === dateStr);
    };

    return (
        <div className="w-full max-w-md mx-auto bg-black border border-neutral-800 rounded-xl overflow-hidden shadow-2xl shadow-black">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-neutral-900 border-b border-neutral-800">
                <button onClick={prevMonth} className="p-2 hover:bg-neutral-800 rounded-full text-neutral-400">
                    <ChevronLeft size={20} />
                </button>
                <h2 className="text-lg font-bold text-white tracking-wider">
                    {format(currentMonth, 'yyyy年 M月', { locale: ja })}
                </h2>
                <button onClick={nextMonth} className="p-2 hover:bg-neutral-800 rounded-full text-neutral-400">
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 bg-neutral-900/50">
                {['日', '月', '火', '水', '木', '金', '土'].map((day, idx) => (
                    <div key={day} className={`py-2 text-center text-xs font-bold ${idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-400' : 'text-neutral-500'}`}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 bg-neutral-800 gap-[1px]">
                {days.map((day) => (
                    <div key={day.toISOString()} className="bg-black">
                        <CalendarCell
                            date={day}
                            currentMonth={currentMonth}
                            records={getRecordsForDate(day)}
                            onClick={() => console.log('Clicked', day)}
                        />
                    </div>
                ))}
            </div>

            {/* Monthly Summary Footer */}
            <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex justify-between items-center text-sm">
                <span className="text-neutral-400">月間合計</span>
                <TotalBalance records={records} currentMonth={currentMonth} />
            </div>
        </div>
    );
};

// Helper for total balance
const TotalBalance = ({ records, currentMonth }: { records: Record[], currentMonth: Date }) => {
    const monthlyRecords = records.filter(r => {
        return format(new Date(r.date), 'yyyy-MM') === format(currentMonth, 'yyyy-MM');
    });

    const total = monthlyRecords.reduce((acc, r) => acc + r.balance, 0);
    const isWin = total > 0;

    return (
        <span className={`font-mono font-bold text-lg ${isWin ? 'text-neon-green' : 'text-red-500'}`}>
            {total > 0 ? '+' : ''}{total.toLocaleString()}
        </span>
    );
};
