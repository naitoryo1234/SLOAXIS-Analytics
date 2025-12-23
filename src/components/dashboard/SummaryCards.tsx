import { Record } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';

export const SummaryCards = ({ records }: { records: Record[] }) => {
    const totalBalance = records.reduce((acc, r) => acc + r.balance, 0);
    const totalWins = records.filter(r => r.balance > 0).length;
    const totalBattles = records.length;
    const winRate = totalBattles > 0 ? (totalWins / totalBattles) * 100 : 0;
    const maxWin = Math.max(...records.map(r => r.balance), 0);

    return (
        <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-green-500/10 rounded-bl-3xl"></div>
                <span className="text-xs text-neutral-500 font-medium mb-1 flex items-center gap-1">
                    <TrendingUp size={12} /> Total
                </span>
                <span className={`text-sm sm:text-base font-bold font-mono tracking-tight ${totalBalance >= 0 ? 'text-neon-green' : 'text-red-500'}`}>
                    {totalBalance > 0 ? '+' : ''}{formatCurrency(totalBalance)}
                </span>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
                <span className="text-xs text-neutral-500 font-medium mb-1 flex items-center gap-1">
                    <Target size={12} /> Win Rate
                </span>
                <span className="text-sm sm:text-base font-bold font-mono tracking-tight text-white">
                    {winRate.toFixed(1)}%
                </span>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-yellow-500/10 rounded-bl-3xl"></div>
                <span className="text-xs text-neutral-500 font-medium mb-1 flex items-center gap-1">
                    <TrendingUp size={12} className="text-gold" /> Max Win
                </span>
                <span className="text-sm sm:text-base font-bold font-mono tracking-tight text-gold">
                    +{formatCurrency(maxWin)}
                </span>
            </div>
        </div>
    );
};
