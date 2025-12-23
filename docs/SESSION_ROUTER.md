# セッション開始ルーター（SLOAXIS Analytics）

このファイルは**新規セッションの最初に読む**ためのルーターファイルです。
ユーザーから「このファイルを読んでください」と言われたら、以下の順で初期化してください。

---

## 0. 最初に守ること（必須）

- 返答・計画書・ドキュメントは**すべて日本語**で記述する
- 破壊的操作や大規模変更は**事前確認**
- 依存追加は**必要性と代替案を示して承認を得る**
- LocalStorage保存方式の変更や外部連携は**事前確認**
- 権利リスクのある画像素材は**追加しない**

---

## 1. 初期化の最小手順

1. `.agent/rules/project-settings.md` を読む
2. `git status -sb` で作業状態を確認
3. 依頼内容が「議論 / 実装 / 安全」のどれか判断し、曖昧なら確認
4. 下記「タスク別インデックス」から該当ファイルだけ読む

---

## 2. プロジェクト概要（1分版）

- 目的: パチスロ収支の記録・分析を支援するモバイル向けWebアプリ
- コンセプト: Mobile First / Dark Mode Casino / Smart Location / Analytics Engine
- 技術: Next.js App Router, TypeScript, Tailwind v4, Recharts, date-fns, LocalStorage
- 主要ページ: ダッシュボード `src/app/page.tsx` / 分析 `src/app/analytics/page.tsx`
- データモデル: `src/types/index.ts`（Record / SavedStore）
- 保存: `src/lib/storage.ts`（LocalStorage）

---

## 3. タスク別インデックス

### 仕様・コンセプト / デザイン
- `SPECIFICATION.md`
- `docs/PROJECT_CONCEPT.md`（本体サイト）
- `docs/PROJECT_CONCEPT_ANALYTICS.md`（Analytics）
- `IMPLEMENTATION_PLAN.md`

### UI / 画面構成
- `src/app/page.tsx`（Dashboard）
- `src/app/analytics/page.tsx`（Analytics）
- `src/components/layout/Header.tsx`
- `src/components/dashboard/*`
- `src/components/calendar/*`
- `src/components/entry/*`
- `src/app/globals.css`
- `src/app/layout.tsx`

### 入力 / Smart Location
- `src/components/entry/EntryModal.tsx`
- `src/components/entry/EntryFab.tsx`
- `src/hooks/useSmartLocation.ts`
- `src/lib/storage.ts`

### 分析ロジック
- `src/lib/analytics-engine.ts`
- `src/lib/analysis.ts`
- `src/lib/utils.ts`

### データ / 保存
- `src/lib/storage.ts`
- `src/lib/dummyData.ts`
- `src/types/index.ts`

### 運用ルール / AIガイド
- `.agent/rules/project-settings.md`
- `.agent/rules/git-safety.md`
- `.agent/rules/voice-input.md`
- `.agent/workflows/session_handover.md`（明示依頼時のみ）

### 進捗 / 履歴
- `docs/STATUS.md`
- `docs/management/PLAN_CHANGELOG.md`

---

## 4. 迷った時の確認質問

- 変更対象はUI / 分析 / 保存 / 仕様のどれか
- 既存ルールの変更を含むか
- 優先度と締切はあるか

---

*Document Version: 1.0 (2025-12-23)*
