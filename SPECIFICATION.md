# SLOAXIS Analytics 開発仕様書

## 1. プロジェクト概要
本ドキュメントは、パチスロ収支管理・分析アプリケーション「SLOAXIS Analytics」の実装仕様について記述します。
本アプリはユーザーの稼働データを記録し、多角的な分析を通じて立ち回りの最適化支援を行うことを目的とします。

**主な特徴:**
*   **Mobile First**: スマートフォンでの利用を前提としたUI/UX。
*   **Dark Mode Casino**: 没入感を高める黒基調のスタイリッシュなデザイン。
*   **Smart Location**: 位置情報を活用した店舗入力支援（API非依存）。
*   **Analytics Engine**: 統計に基づいた高度な収支分析機能。

## 2. 実装済みの技術スタック

*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript 5.7
*   **Styling**: Tailwind CSS v4
*   **UI Icons**: Lucide React
*   **Charts**: Recharts
*   **Date Handling**: date-fns
*   **State/Persistence**: React State Hooks + LocalStorage

## 3. ディレクトリ構成

```
src/
├── app/
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ダッシュボード (Home)
│   ├── analytics/
│   │   └── page.tsx       # 分析ページ
│   └── globals.css        # グローバルスタイル (Tailwind Config含む)
├── components/
│   ├── calendar/          # カレンダー関連 (MonthCalendar, CalendarCell)
│   ├── dashboard/         # ダッシュボード (SummaryCards, InsightTip)
│   ├── entry/             # 入力フォーム (EntryModal, EntryFab)
│   └── layout/            # 共通レイアウト (Header)
├── hooks/
│   └── useSmartLocation.ts # 位置情報・店舗提案ロジック
├── lib/
│   ├── analysis.ts        # (旧) 簡易インサイト生成
│   ├── analytics-engine.ts # (新) 高度分析エンジン
│   ├── dummyData.ts       # デモデータ生成
│   ├── storage.ts         # データ永続化層
│   └── utils.ts           # ユーティリティ
└── types/
    └── index.ts           # 型定義
```

## 4. 機能仕様

### 4.1 データモデル (Data Model)
*   **Record**: 1回の稼働データ。
    *   `id` (UUID), `date`, `storeName`, `machineName`, `investment`, `recovery`, `balance`, `tags`
*   **SavedStore**: ユーザーが利用した店舗の位置情報履歴。
    *   `name`, `lat`, `lng`, `lastVisited`

### 4.2 機能詳細

#### A) ダッシュボード (Dashboard)
*   **月間カレンダー**: `src/components/calendar/MonthCalendar.tsx`
    *   日ごとの収支を表示。
    *   勝利時はネオングリーン、敗北時は赤、大勝利(+10万)はゴールドで表示。
*   **サマリーカード**: 総収支、勝率、最大獲得額を表示。
*   **簡易インサイト**: 直近の傾向からワンポイントアドバイスを表示。

#### B) 稼働記録入力 (Record Entry)
*   **モーダルフォーム**: `src/components/entry/EntryModal.tsx`
*   **スマートロケーション機能**: `src/hooks/useSmartLocation.ts`
    *   `navigator.geolocation` を使用。
    *   過去に訪問した店舗（LocalStorage内）と現在地の距離を計算。
    *   500m以内に店舗があれば、入力候補として自動提案。

#### C) 分析機能 (Analytics)
*   **分析エンジン**: `src/lib/analytics-engine.ts`
    *   クライアントサイドで全件データを再集計。
    *   **立ち回り評価**: タグごとのROI算出。
    *   **機種別分析**: 機種ごとの勝率・収支ランキング。
    *   **店舗攻略**: 店舗×特定日（末尾など）の相性分析。
    *   **ドローダウン監視**: 累積収支の最大下落幅を計測しアラートを表示。
*   **可視化**: `src/app/analytics/page.tsx`
    *   Rechartsを使用したグラフ表示（棒グラフ、折れ線グラフ）。

### 5. デザインシステム (Design Tokens)

*   **Colors**:
    *   Background: `#0a0a0a`
    *   Win (Neon Green): `#4ade80`
    *   Loss (Muted Red): `#f87171`
    *   High Win (Gold): `#ffd700`
*   **Typography**:
    *   数字には `tabular-nums` を適用し、桁揃えを徹底。

## 6. 今後の拡張・改善点 (For Future Dev)

1.  **データ入力の強化**:
    *   「稼働時間」「期待値」フィールドの追加による時給計算・期待値稼働分析の実装。
2.  **分析UIの拡充**:
    *   「機種マトリクス（収支×勝率）」の散布図描画。
    *   店舗ごとの「特定日カレンダーUI」の実装。
3.  **データバックアップ**:
    *   LocalStorage依存からの脱却（クラウド同期の実装）。

---
*Created by Antigravity Agents*
