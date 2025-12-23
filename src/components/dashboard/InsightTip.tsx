import { Record } from '@/types';
import { analyzeRecords } from '@/lib/analysis';
import { Sparkles } from 'lucide-react';

export const InsightTip = ({ records }: { records: Record[] }) => {
    const tip = analyzeRecords(records);

    return (
        <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-4 flex items-start space-x-3 mb-6">
            <div className="p-2 bg-indigo-500/20 rounded-full shrink-0">
                <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
                <h3 className="text-sm font-bold text-indigo-200 mb-1">AI Analyst</h3>
                <p className="text-sm text-indigo-100/80 leading-relaxed">
                    {tip}
                </p>
            </div>
        </div>
    );
};
