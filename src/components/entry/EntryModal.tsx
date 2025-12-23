import { useState, useEffect } from 'react';
import { Record } from '@/types';
import { useSmartLocation } from '@/hooks/useSmartLocation';
import { X, MapPin, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface EntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (record: Omit<Record, 'id' | 'balance'>) => void;
}

export const EntryModal = ({ isOpen, onClose, onSave }: EntryModalProps) => {
    const { detectLocation, currentLocation, suggestedStore, loading: locLoading } = useSmartLocation();

    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [storeName, setStoreName] = useState('');
    const [machineName, setMachineName] = useState('');
    const [investment, setInvestment] = useState('');
    const [recovery, setRecovery] = useState('');

    // Smart Location Effect
    useEffect(() => {
        if (isOpen) {
            // Reset form or keep date? keeping date is better
            detectLocation();
        }
    }, [isOpen]);

    useEffect(() => {
        if (suggestedStore) {
            setStoreName(suggestedStore.name);
        }
    }, [suggestedStore]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            date,
            storeName,
            machineName,
            investment: Number(investment),
            recovery: Number(recovery),
            tags: [],
            location: currentLocation || undefined
        });
        // clear and close
        setStoreName('');
        setMachineName('');
        setInvestment('');
        setRecovery('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950">
                    <h2 className="text-lg font-bold text-white">新規稼働記録</h2>
                    <button onClick={onClose} className="p-2 bg-neutral-800 rounded-full text-neutral-400 hover:text-white">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Date */}
                    <div>
                        <label className="block text-xs font-medium text-neutral-500 mb-1">日付</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                            required
                        />
                    </div>

                    {/* Store (Smart Suggest) */}
                    <div>
                        <label className="block text-xs font-medium text-neutral-500 mb-1 flex items-center justify-between">
                            <span>店舗名</span>
                            {locLoading && <span className="flex items-center gap-1 text-neon-green"><Loader2 size={10} className="animate-spin" /> 位置情報取得中...</span>}
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                placeholder="店舗名を入力"
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-3 pr-10 py-2 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                                required
                            />
                            <MapPin className={`absolute right-3 top-2.5 w-5 h-5 ${suggestedStore ? 'text-neon-green' : 'text-neutral-600'}`} />
                        </div>
                        {suggestedStore && (
                            <p className="text-xs text-neon-green mt-1">📍 近くのいつもの店: {suggestedStore.name}</p>
                        )}
                    </div>

                    {/* Machine */}
                    <div>
                        <label className="block text-xs font-medium text-neutral-500 mb-1">機種名</label>
                        <input
                            type="text"
                            value={machineName}
                            onChange={(e) => setMachineName(e.target.value)}
                            placeholder="例: 北斗の拳"
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                            required
                        />
                    </div>

                    {/* Money */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-neutral-500 mb-1">投資 (円)</label>
                            <input
                                type="number"
                                value={investment}
                                onChange={(e) => setInvestment(e.target.value)}
                                placeholder="0"
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-neutral-500 mb-1">回収 (円)</label>
                            <input
                                type="number"
                                value={recovery}
                                onChange={(e) => setRecovery(e.target.value)}
                                placeholder="0"
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full mt-4 bg-gradient-to-r from-neon-green to-green-500 text-black font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(74,222,128,0.3)] hover:shadow-[0_0_25px_rgba(74,222,128,0.5)] transition-all active:scale-[0.98]"
                    >
                        保存する
                    </button>
                </form>
            </div>
        </div>
    );
};
