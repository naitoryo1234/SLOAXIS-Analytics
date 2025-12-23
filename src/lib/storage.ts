import { Record, SavedStore } from '@/types';

const STORAGE_KEY_RECORDS = 'sloaxis_records';
const STORAGE_KEY_STORES = 'sloaxis_stores';

export const getRecords = (): Record[] => {
    if (typeof window === 'undefined') return [];
    const start = localStorage.getItem(STORAGE_KEY_RECORDS);
    return start ? JSON.parse(start) : [];
};

export const saveRecords = (records: Record[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
};

export const getSavedStores = (): SavedStore[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY_STORES);
    return stored ? JSON.parse(stored) : [];
};

export const saveStore = (store: SavedStore) => {
    if (typeof window === 'undefined') return;
    const stores = getSavedStores();
    const existingIndex = stores.findIndex(s => s.name === store.name);
    if (existingIndex >= 0) {
        stores[existingIndex] = store;
    } else {
        stores.push(store);
    }
    localStorage.setItem(STORAGE_KEY_STORES, JSON.stringify(stores));
};
