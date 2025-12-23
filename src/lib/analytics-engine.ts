import { Record as AppRecord } from '@/types';
import { getDay, getDate } from 'date-fns';

// 基本的な統計データ型
export interface BasicStats {
    count: number;
    wins: number;
    winRate: number;
    totalBalance: number;
    avgBalance: number;
    totalInvestment: number;
    totalRecovery: number;
    roi: number; // Return On Investment (%)
}

export interface AnalyticsResult {
    overview: BasicStats;
    byMachine: Record<string, BasicStats>;
    byStore: Record<string, BasicStats>;
    byTag: Record<string, BasicStats>;
    byDayOfWeek: BasicStats[]; // 0=Sun, 6=Sat
    storeDateHabits: Record<string, { // 店舗別の特定日傾向
        byDateEnding: Record<string, BasicStats>; // "0"~"9"
    }>;
    drawdown: {
        current: number;
        max: number;
    };
}

// 統計計算ヘルパー
const calculateStats = (subset: AppRecord[]): BasicStats => {
    const count = subset.length;
    if (count === 0) {
        return { count: 0, wins: 0, winRate: 0, totalBalance: 0, avgBalance: 0, totalInvestment: 0, totalRecovery: 0, roi: 0 };
    }

    const wins = subset.filter(r => r.balance > 0).length;
    const totalBalance = subset.reduce((acc, r) => acc + r.balance, 0);
    const totalInvestment = subset.reduce((acc, r) => acc + r.investment, 0);
    const totalRecovery = subset.reduce((acc, r) => acc + r.recovery, 0);

    return {
        count,
        wins,
        winRate: (wins / count) * 100,
        totalBalance,
        avgBalance: totalBalance / count,
        totalInvestment,
        totalRecovery,
        roi: totalInvestment > 0 ? (totalRecovery / totalInvestment) * 100 : 0
    };
};

export const runAnalytics = (records: AppRecord[]): AnalyticsResult => {
    // 1. 各種グルーピング用コンテナ
    const machineGroups: { [key: string]: AppRecord[] } = {};
    const storeGroups: { [key: string]: AppRecord[] } = {};
    const tagGroups: { [key: string]: AppRecord[] } = {};
    const dayGroups: AppRecord[][] = Array(7).fill(null).map(() => []);
    const storeDateEndingGroups: { [store: string]: { [ending: string]: AppRecord[] } } = {};

    // 2. グルーピング実行
    records.forEach(r => {
        // Machine
        if (!machineGroups[r.machineName]) machineGroups[r.machineName] = [];
        machineGroups[r.machineName].push(r);

        // Store
        if (!storeGroups[r.storeName]) storeGroups[r.storeName] = [];
        storeGroups[r.storeName].push(r);

        // Tags
        r.tags.forEach(tag => {
            if (!tagGroups[tag]) tagGroups[tag] = [];
            tagGroups[tag].push(r);
        });
        // If no tags, classify as "No Tag"
        if (r.tags.length === 0) {
            if (!tagGroups['No Tag']) tagGroups['No Tag'] = [];
            tagGroups['No Tag'].push(r);
        }

        // Day of Week
        const date = new Date(r.date);
        dayGroups[getDay(date)].push(r);

        // Store Date Ending (日付の末尾)
        // 3日, 13日, 23日 -> ending "3"
        const dayOfMonth = getDate(date);
        const ending = (dayOfMonth % 10).toString();

        if (!storeDateEndingGroups[r.storeName]) storeDateEndingGroups[r.storeName] = {};
        if (!storeDateEndingGroups[r.storeName][ending]) storeDateEndingGroups[r.storeName][ending] = [];
        storeDateEndingGroups[r.storeName][ending].push(r);
    });

    // 3. ドローダウン計算 (時系列に並べる必要あり)
    const sortedRecords = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let currentBalance = 0;
    let maxBalance = 0; // 累積収支の最高点
    let maxDrawdown = 0;

    sortedRecords.forEach(r => {
        currentBalance += r.balance;
        if (currentBalance > maxBalance) {
            maxBalance = currentBalance;
        }
        const drawdown = maxBalance - currentBalance;
        if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
        }
    });

    // 4. 結果の整形
    const byMachine: Record<string, BasicStats> = {};
    Object.keys(machineGroups).forEach(k => byMachine[k] = calculateStats(machineGroups[k]));

    const byStore: Record<string, BasicStats> = {};
    Object.keys(storeGroups).forEach(k => byStore[k] = calculateStats(storeGroups[k]));

    const byTag: Record<string, BasicStats> = {};
    Object.keys(tagGroups).forEach(k => byTag[k] = calculateStats(tagGroups[k]));

    const byDayOfWeek = dayGroups.map(group => calculateStats(group));

    const storeDateHabits: Record<string, { byDateEnding: Record<string, BasicStats> }> = {};
    Object.keys(storeDateEndingGroups).forEach(store => {
        storeDateHabits[store] = { byDateEnding: {} };
        Object.keys(storeDateEndingGroups[store]).forEach(ending => {
            storeDateHabits[store].byDateEnding[ending] = calculateStats(storeDateEndingGroups[store][ending]);
        });
    });

    return {
        overview: calculateStats(records),
        byMachine,
        byStore,
        byTag,
        byDayOfWeek,
        storeDateHabits,
        drawdown: {
            current: maxBalance - currentBalance,
            max: maxDrawdown
        }
    };
};
