# SLOAXIS Analytics 開発計画書

## 1. プロジェクト概要
パチスロ収支管理アプリ「SLOAXIS Analytics」の開発。
モバイルファースト、ダークモードカジノテーマ、位置情報活用、カレンダー可視化を特徴とする。

## 2. デザインシステム (Dark Mode Casino)

### カラーパレット
- **Background**: `#0a0a0a` (漆黒)
- **Primary (Win)**: `#4ade80` (Neon Green - text-green-400)
- **Secondary (Loss)**: `#f87171` (Muted Red - text-red-400)
- **Accent (High Win/Jackpot)**: `#ffd700` (Gold - text-yellow-400)
- **Surface**: `#171717` (neutral-900) or `#262626` (neutral-800) for cards/modals.
- **Text**: White for headings, Gray-400 for secondary text.

### タイポグラフィ
- 数値: `tabular-nums` (等幅) を適用し、桁揃えを徹底。
- フォント: Inter (Default Next.js) + Monospace for numbers.

## 3. データ構造 (TypeScript Interfaces)

```typescript
// src/types/index.ts

export interface Record {
  id: string;
  date: string; // ISO string or YYYY-MM-DD
  storeName: string;
  machineName: string;
  investment: number; // 投資 (円)
  recovery: number;   // 回収 (円)
  balance: number;    // 収支 (円) - 自動計算
  tags: string[];     // イベント, 天井狙い, etc.
  location?: {        // 位置情報 (オプション) 
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
```

## 4. コンポーネント構成

- `src/components/layout/Header.tsx`: ロゴ、ナビゲーション
- `src/components/dashboard/SummaryCards.tsx`: 総収支、勝率などのカード
- `src/components/dashboard/InsightTip.tsx`: 分析インサイト表示
- `src/components/calendar/MonthCalendar.tsx`: 月間カレンダー (CSS Grid)
- `src/components/calendar/CalendarCell.tsx`: 日付セル
- `src/components/entry/EntryFab.tsx`: 新規登録ボタン (Floating Action Button)
- `src/components/entry/EntryModal.tsx`: 入力フォーム (ロケーション提案含む)
- `src/hooks/useSmartLocation.ts`: 位置情報と店舗提案ロジック
- `src/lib/storage.ts`: LocalStorage管理
- `src/lib/dummyData.ts`: デモ用データ生成

## 5. 実装ステップ

1.  **基盤セットアップ**:
    - `globals.css` で基本テーマ設定。
    - `src/types/index.ts` 作成。
    - `src/lib/storage.ts` でデータ永続化層作成。
    - `src/lib/dummyData.ts` で初期データ投入ロジック作成。

2.  **ロケーション機能 (Smart Location)**:
    - `useSmartLocation` フックの実装。
    - 距離計算ロジック (Haversine formula)。

3.  **カレンダー機能**:
    - `MonthCalendar` 実装。`date-fns` を使用してカレンダーグリッド生成。
    - レスポンシブ対応 (モバイルでは日付の数字と収支のみをシンプルに表示)。

4.  **インサイト機能**:
    - データを分析してテキストを生成するロジック実装。

5.  **UI統合**:
    - `page.tsx` (Dashboard) の構築。
    - デザインの微調整 (Gold, Neon Greenの適用)。

## 6. ディレクトリ構造 (予定)
```
src/
  app/
    page.tsx
    layout.tsx
    globals.css
  components/
    ui/ (Button, Card, Input etc.)
    calendar/
    dashboard/
    entry/
  lib/
    utils.ts (clsx, tailwind-merge)
    storage.ts
    dummyData.ts
    analysis.ts
  hooks/
    useSmartLocation.ts
    useRecords.ts
  types/
    index.ts
```
