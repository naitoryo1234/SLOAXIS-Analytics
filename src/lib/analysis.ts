import { Record } from '@/types';
import { getDay } from 'date-fns';

export const analyzeRecords = (records: Record[]): string => {
    if (records.length < 5) return "データを増やしてインサイトを解放しましょう。";

    // 1. Analyze by Day of Week
    const dayStats = Array(7).fill(0).map(() => ({ wins: 0, total: 0, balance: 0 }));
    const days = ['日', '月', '火', '水', '木', '金', '土'];

    records.forEach(r => {
        const day = getDay(new Date(r.date));
        dayStats[day].total++;
        dayStats[day].balance += r.balance;
        if (r.balance > 0) dayStats[day].wins++;
    });

    // Find best day
    let bestDayIndex = -1;
    let maxWinRate = -1;

    dayStats.forEach((stat, index) => {
        if (stat.total >= 3) {
            const rate = stat.wins / stat.total;
            if (rate > maxWinRate) {
                maxWinRate = rate;
                bestDayIndex = index;
            }
        }
    });

    if (bestDayIndex !== -1 && maxWinRate >= 0.7) {
        return `💡 ヒント: ${days[bestDayIndex]}曜日の勝率が ${(maxWinRate * 100).toFixed(0)}% です。${days[bestDayIndex]}曜日は攻め時かも？`;
    }

    // 2. Machine Analysis (Simple)
    const machineStats: { [key: string]: number } = {};
    records.forEach(r => {
        if (!machineStats[r.machineName]) machineStats[r.machineName] = 0;
        machineStats[r.machineName] += r.balance;
    });

    const bestMachine = Object.entries(machineStats).sort((a, b) => b[1] - a[1])[0];
    if (bestMachine && bestMachine[1] > 50000) {
        return `💡 ヒント: 「${bestMachine[0]}」との相性が抜群です（+${(bestMachine[1] / 10000).toFixed(1)}万）。`;
    }

    // Default
    const totalBalance = records.reduce((acc, r) => acc + r.balance, 0);
    if (totalBalance < 0) {
        return "⚠️ 注意: 全体的に負け越しています。投資額の上限（ストッパー）を決めましょう。";
    }

    return "✨ Good Luck! 記録を続けて傾向を掴みましょう。";
};
