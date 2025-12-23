---
trigger: always_on
---

# Project Settings: Team-Sloaxis (AI Agent)

<!--
AI AGENT INSTRUCTION:
このファイルは「このリポジトリ固有」のAI運用ルール要約です。
セッション開始時に読み、役割境界・安全・進め方を確立してください。
-->

---

## Project Overview

| 項目 | 内容 |
|:---|:---|
| プロジェクト名 | SLOAXIS Analytics |
| 目的 | パチスロ収支管理・分析を支援するモバイル向けWebアプリ |
| コンセプト | Mobile First / Dark Mode Casino / Smart Location / Analytics Engine |

---

## Tech Stack

| レイヤー | 技術 |
|:---|:---|
| Frontend | Next.js 16.1.1 (App Router), React 19.2.3, TypeScript 5.7 |
| Styling | Tailwind CSS v4 |
| UI Icons | Lucide React |
| Charts | Recharts |
| Date | date-fns |
| State/Persistence | React Hooks + LocalStorage |
| Lint | ESLint |
| Deploy | Vercel |

---

## Directory Structure（要点）

```text
/
├── src/
│   ├── app/                 # App Router（Dashboard/Analytics）
│   ├── components/          # calendar/dashboard/entry/layout
│   ├── hooks/               # useSmartLocation など
│   ├── lib/                 # analytics-engine, storage, dummyData, utils
│   └── types/               # 型定義
├── public/                  # 静的アセット
├── .agent/                  # AI運用ルール/ワークフロー
├── SPECIFICATION.md         # 実装仕様
├── IMPLEMENTATION_PLAN.md   # 開発計画
└── README.md                # セットアップ手順
```

---

## Team Definition（役割境界）

| 領域 | 役割 |
|:---|:---|
| SLOAXIS Analytics（本リポジトリ） | UI/フロント、クライアントサイド分析、LocalStorage保存、ドキュメント |
| 外部連携/バックエンド（別領域） | API/クラウド同期/DB（必要時は事前確認） |

---

## Session Start Checklist

1. `git status -sb` で作業状態を確認
2. 依頼が「議論」か「実装」かを判定（迷ったら確認）
3. 必要なドキュメントだけ読む（闇雲に全読しない）
4. 具体指示がない場合は「どのタスクに着手しますか？」と確認

---

## Mode Definitions

### 議論モード
- トリガー: 「相談したい」「設計して」「どう思う？」
- 振る舞い: すぐに実装しない。複数案＋メリデメ＋推奨案＋確認で進める。

### 実装モード
- トリガー: 「修正して」「コード書いて」「追加して」
- 振る舞い: 小さく安全に変更し、確認手順までセットで提示する。

### 安全チェックモード
- トリガー: 「削除して」「初期化して」「大規模に変えて」
- 振る舞い: 一旦停止。リスク・代替案・確認ポイントを提示し、明示許可が出るまで実行しない。

### 音声補正モード
- 前提: ユーザーは Windows 音声入力。誤変換が起きる。
- 方針: 文脈で確度高く補正し、曖昧なら短い質問で確認する。

---

## Project-Specific Restrictions

### 応答言語
- 返答・計画書・ドキュメント類は**すべて日本語**で記述する

### 文字コード/改行
- すべて UTF-8（BOMなし）+ LF（`.editorconfig` / `.gitattributes` 準拠）

### 推測で進めない
- 仕様・データを勝手に補完しない。不明点は確認する。

### Git 安全
- `main` へ直接コミットしない（作業は別ブランチ）
- `git push` はユーザー依頼があるまで行わない
- `git reset --hard` / `git push -f` / ファイル削除 / 初期化系は明示許可が必要

### 役割境界
- 本リポジトリはフロント/UI/クライアント分析に閉じて作業する
- サーバー/DB/クラウド同期や外部APIを追加する場合は事前確認する

### データ保存
- 収支データは LocalStorage に保存（`src/lib/storage.ts`）
- 保存方式の変更や外部連携は事前確認する

### アセット
- メーカー公式画像など、権利的に問題のある画像を追加しない

### 依存追加
- npmパッケージ追加は必要性と代替案を提示し、ユーザー承認を得る

---

## Workflows / Commands

- `/session_handover`: セッション終了時の引き継ぎ（`.agent/workflows/session_handover.md`）
  - ユーザーから明示がない限り実行しない（勝手にまとめない）
  - 実行後は次のタスクに着手しない（ここで終了）

---

## Reference Documents

| 用途 | ファイル |
|:---|:---|
| 実装仕様 | `SPECIFICATION.md` |
| 開発計画 | `IMPLEMENTATION_PLAN.md` |
| セットアップ/起動 | `README.md` |
| データモデル | `src/types/index.ts` |
| 分析エンジン | `src/lib/analytics-engine.ts` |
| 位置情報ロジック | `src/hooks/useSmartLocation.ts` |
| AI補助ルール | `.agent/rules/git-safety.md` / `.agent/rules/voice-input.md` |

---

## Notes

- `docs/` 配下の正本ドキュメントは未配置。仕様と計画はルートの `SPECIFICATION.md` / `IMPLEMENTATION_PLAN.md` を参照する。

*Project Settings Version: 1.1 (2025-12-23)*
