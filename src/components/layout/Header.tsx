import { Zap, PieChart } from 'lucide-react';
import Link from 'next/link';

export const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-md border-b border-neutral-800 z-50 flex items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                    <Zap className="text-black w-5 h-5 fill-current" />
                </div>
                <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                    SLOAXIS
                </h1>
            </Link>

            <Link href="/analytics" className="p-2 text-neutral-400 hover:text-white transition-colors">
                <PieChart size={24} />
            </Link>
        </header>
    );
};
