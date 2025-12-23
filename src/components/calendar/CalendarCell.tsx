import { Record } from '@/types';
import { cn, formatCurrency } from '@/lib/utils';
import { getDate, isSameMonth, isToday } from 'date-fns';

interface CalendarCellProps {
    date: Date;
    currentMonth: Date;
    records: Record[];
    onClick: () => void;
}

export const CalendarCell = ({ date, currentMonth, records, onClick }: CalendarCellProps) => {
    const dayRecords = records || [];
    const dailyBalance = dayRecords.reduce((acc, r) => acc + r.balance, 0);
    const hasRecords = dayRecords.length > 0;

    const isWin = dailyBalance > 0;
    const isBigWin = dailyBalance >= 100000;
    const isLoss = dailyBalance < 0;

    return (
        <div
            onClick={onClick}
            className={cn(
                "relative flex flex-col items-center justify-start py-2 h-20 sm:h-24 border border-neutral-800 transition-colors hover:bg-neutral-800/50 cursor-pointer",
                !isSameMonth(date, currentMonth) && "opacity-30 bg-neutral-900/20",
                isToday(date) && "bg-neutral-800/80 border-neutral-600",
                isBigWin && "bg-yellow-900/10 border-yellow-500/30"
            )}
        >
            <span className={cn(
                "text-xs font-semibold mb-1",
                isToday(date) ? "text-white" : "text-neutral-500"
            )}>
                {getDate(date)}
            </span>

            {hasRecords && (
                <div className="flex flex-col items-center justify-center flex-1 w-full px-1">
                    <span className={cn(
                        "text-xs sm:text-sm font-bold font-mono tracking-tighter tabular-nums",
                        isBigWin ? "text-gold animate-pulse" : isWin ? "text-neon-green" : isLoss ? "text-red-400" : "text-neutral-400"
                    )}>
                        {dailyBalance > 0 ? '+' : ''}{Math.floor(dailyBalance / 1000)}k
                    </span>
                    {/* Mobile view could be just '30k', Desktop detailed tooltips perhaps */}
                </div>
            )}
        </div>
    );
};
