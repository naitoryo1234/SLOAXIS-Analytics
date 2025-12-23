export interface Record {
    id: string;
    date: string; // ISO string 2023-12-23
    storeName: string;
    machineName: string;
    investment: number;
    recovery: number;
    balance: number;
    tags: string[];
    location?: {
        lat: number;
        lng: number;
    };
}

export interface SavedStore {
    name: string;
    lat: number;
    lng: number;
    lastVisited: string;
}

export type ThemeColor = 'win' | 'loss' | 'high-win' | 'neutral';
