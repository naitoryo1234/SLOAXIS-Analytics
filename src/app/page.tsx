'use client';

import { useState, useEffect } from 'react';
import { Record } from '@/types';
import { getRecords, saveRecords, saveStore } from '@/lib/storage';
import { generateDummyData } from '@/lib/dummyData';
import { Header } from '@/components/layout/Header';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { InsightTip } from '@/components/dashboard/InsightTip';
import { MonthCalendar } from '@/components/calendar/MonthCalendar';
import { EntryFab } from '@/components/entry/EntryFab';
import { EntryModal } from '@/components/entry/EntryModal';

export default function Home() {
  const [records, setRecords] = useState<Record[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // initialize data
    const stored = getRecords();
    if (stored.length === 0) {
      const dummy = generateDummyData();
      saveRecords(dummy);
      setRecords(dummy);

      // Save dummy stores to storage for smart location demo
      const uniqueStores = Array.from(new Set(dummy.map(r => r.storeName)));
      uniqueStores.forEach(name => {
        const r = dummy.find(d => d.storeName === name);
        if (r && r.location) {
          saveStore({
            name: r.storeName,
            lat: r.location.lat,
            lng: r.location.lng,
            lastVisited: r.date
          });
        }
      });
    } else {
      setRecords(stored);
    }
    setIsInitialized(true);
  }, []);

  const handleAddRecord = (newRecordData: Omit<Record, 'id' | 'balance'>) => {
    const newRecord: Record = {
      ...newRecordData,
      id: crypto.randomUUID(),
      balance: newRecordData.recovery - newRecordData.investment
    };

    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);
    saveRecords(updatedRecords);

    // Save location for future suggestions
    if (newRecord.location) {
      saveStore({
        name: newRecord.storeName,
        lat: newRecord.location.lat,
        lng: newRecord.location.lng,
        lastVisited: newRecord.date
      });
    }
  };

  if (!isInitialized) return null; // or loading spinner

  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-24">
      <Header />

      <div className="pt-20 px-4 sm:px-6 max-w-md mx-auto">
        <SummaryCards records={records} />

        <InsightTip records={records} />

        <h2 className="text-white font-bold mb-4 text-lg">Calendar</h2>
        <MonthCalendar records={records} />

        {/* Recent History List (Mini) - Optional if time permits, for now Calendar is main */}
        <div className="mt-8">
          <h2 className="text-white font-bold mb-4 text-lg">Recent History</h2>
          <div className="space-y-3">
            {records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map(record => (
              <div key={record.id} className="bg-neutral-900/50 border border-neutral-800 p-3 rounded-lg flex justify-between items-center">
                <div>
                  <div className="text-xs text-neutral-500">{record.date}</div>
                  <div className="font-bold text-sm text-neutral-300">{record.storeName} - {record.machineName}</div>
                </div>
                <div className={`font-mono font-bold ${record.balance > 0 ? 'text-neon-green' : 'text-red-500'}`}>
                  {record.balance > 0 ? '+' : ''}{record.balance.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <EntryFab onClick={() => setIsModalOpen(true)} />

      <EntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddRecord}
      />
    </main>
  );
}
