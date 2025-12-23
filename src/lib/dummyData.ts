import { Record } from '@/types';
import { addDays, format, startOfMonth, subMonths } from 'date-fns';

export const generateDummyData = (): Record[] => {
    const records: Record[] = [];
    const today = new Date();
    const startOfCurrentMonth = startOfMonth(today);

    // 今月と先月のデータを作成
    const monthsToGenerate = [startOfCurrentMonth, startOfMonth(subMonths(today, 1))];

    monthsToGenerate.forEach((monthStart) => {
        // 5のつく日は勝つ (Smart Insight用)
        // 週末は負ける

        for (let i = 0; i < 30; i++) {
            const currentDate = addDays(monthStart, i);
            const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
            const isFifth = (i + 1) % 5 === 0;

            // 稼働頻度: 50%
            if (Math.random() > 0.5) continue;

            let investment = 0;
            let recovery = 0;
            let machineName = '北斗の拳';
            let storeName = 'SLOAXIS 店';

            if (isFifth) {
                // 5のつく日は勝つ
                investment = Math.floor(Math.random() * 30) * 1000 + 10000;
                recovery = investment + Math.floor(Math.random() * 50) * 1000 + 20000;
                machineName = 'ヴァルヴレイヴ'; // 強い機種
            } else if (isWeekend) {
                // 週末は負ける
                investment = Math.floor(Math.random() * 40) * 1000 + 20000;
                recovery = Math.floor(Math.random() * 10) * 1000;
            } else {
                // 通常営業日
                investment = Math.floor(Math.random() * 20) * 1000 + 10000;
                recovery = Math.random() > 0.6 ? investment + 5000 : 0;
            }

            // 1件だけHuge Winを作る (今月の15日あたり)
            if (i === 14 && monthStart === startOfCurrentMonth) {
                investment = 20000;
                recovery = 145000; // +125,000
                machineName = 'からくりサーカス';
                storeName = 'グランドアクシス';
            }

            records.push({
                id: crypto.randomUUID(),
                date: format(currentDate, 'yyyy-MM-dd'),
                storeName,
                machineName,
                investment,
                recovery,
                balance: recovery - investment,
                tags: isFifth ? ['特定日'] : [],
                location: {
                    lat: 35.6812 + (Math.random() - 0.5) * 0.1,
                    lng: 139.7671 + (Math.random() - 0.5) * 0.1
                }
            });
        }
    });

    return records;
};
