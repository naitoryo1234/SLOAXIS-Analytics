import { Plus } from 'lucide-react';

export const EntryFab = ({ onClick }: { onClick: () => void }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 w-14 h-14 bg-neon-green hover:bg-green-400 text-black rounded-full shadow-[0_0_20px_rgba(74,222,128,0.4)] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-40"
        >
            <Plus size={28} strokeWidth={3} />
        </button>
    );
};
