'use client';

import { useState, useEffect } from 'react';
import { Record } from '@/types';
import { getRecords } from '@/lib/storage';
import { runAnalytics, AnalyticsResult } from '@/lib/analytics-engine';
import { Header } from '@/components/layout/Header';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
    LineChart, Line, CartesianGrid
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, AlertTriangle, Calendar, Target } from 'lucide-react';

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsResult | null>(null);

    useEffect(() => {
        const records = getRecords();
        if (records.length > 0) {
            setData(runAnalytics(records));
        }
    }, []);

    if (!data) return <div className="min-h-screen bg-[#0a0a0a] pt-20 text-center text-neutral-500">データ収集中...</div>;

    const tagData = Object.entries(data.byTag).map(([name, stats]) => ({
        name,
        balance: stats.totalBalance,
        winRate: stats.winRate
    })).sort((a, b) => b.balance - a.balance);

    const machineData = Object.entries(data.byMachine)
        .map(([name, stats]) => ({ name, balance: stats.totalBalance }))
        .sort((a, b) => b.balance - a.balance)
        .slice(0, 5); // Top 5

    return (
        <main className="min-h-screen bg-[#0a0a0a] pb-24">
            <Header />

            <div className="pt-20 px-4 sm:px-6 max-w-2xl mx-auto space-y-8">

                {/* Title */}
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        <TrendingUp className="text-neon-green" />
                        Analytics
                    </h2>
                    <p className="text-neutral-500 text-sm">戦略的立ち回りのための分析レポート</p>
                </div>

                {/* Drawdown Alert */}
                {data.drawdown.current > 50000 && (
                    <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="text-red-500 shrink-0" />
                        <div>
                            <h3 className="font-bold text-red-200">ドローダウン警告</h3>
                            <p className="text-sm text-red-300/80">
                                現在、ピーク時から <span className="font-mono font-bold text-red-400">-{formatCurrency(data.drawdown.current)}</span> の下落が発生しています。
                                乱れ打ちを避け、堅実な立ち回り（Aタイプ等）への切り替えを推奨します。
                            </p>
                        </div>
                    </div>
                )}

                {/* 1. Tag Performance (立ち回り通信簿) */}
                <section className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Target size={18} className="text-gold" /> 立ち回り別収支
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={tagData} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#a3a3a3', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626' }}
                                    formatter={(value: any) => [formatCurrency(Number(value)), '収支']}
                                />
                                <Bar dataKey="balance" radius={[0, 4, 4, 0]}>
                                    {tagData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.balance >= 0 ? '#4ade80' : '#f87171'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2 text-center">
                        *ROI（投資効率）を意識して、マイナスの立ち回りは排除しましょう。
                    </p>
                </section>

                {/* 2. Machine Ranking */}
                <section className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
                    <h3 className="text-lg font-bold text-white mb-4">機種別収支 (Top 5)</h3>
                    <div className="space-y-3">
                        {machineData.map((m, i) => (
                            <div key={m.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded ${i < 3 ? 'bg-gold text-black' : 'bg-neutral-800 text-neutral-400'}`}>
                                        {i + 1}
                                    </span>
                                    <span className="text-sm text-neutral-200 font-medium">{m.name}</span>
                                </div>
                                <span className={`font-mono font-bold text-sm ${m.balance > 0 ? 'text-neon-green' : 'text-red-500'}`}>
                                    {m.balance > 0 ? '+' : ''}{formatCurrency(m.balance)}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Day of Week Analysis */}
                <section className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Calendar size={18} className="text-blue-400" /> 曜日別勝率
                    </h3>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.byDayOfWeek.map((d, i) => ({ day: ['日', '月', '火', '水', '木', '金', '土'][i], rate: d.winRate }))}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                                <XAxis dataKey="day" tick={{ fill: '#737373' }} />
                                <YAxis tick={{ fill: '#737373' }} unit="%" />
                                <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626' }} />
                                <Line type="monotone" dataKey="rate" stroke="#4ade80" strokeWidth={2} dot={{ fill: '#000', stroke: '#4ade80', r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>

            </div>
        </main>
    );
}
