# Design System

プロトコルフロー図のデザイン定数。

## 目次

1. [カラーパレット](#カラーパレット)
2. [タイポグラフィ](#タイポグラフィ)
3. [間隔・サイズ定数](#間隔サイズ定数)
4. [SVG defs テンプレート](#svg-defs-テンプレート)

---

## カラーパレット

### ダークテーマ（デフォルト）

```
背景:
  bgGrad-start:    #0f172a    (濃紺)
  bgGrad-end:      #1e293b    (やや明るい紺)
  card-bg:         #1e1b2e    (アクターカード背景)
  panel-bg:        #0f172a    (サイドバー背景)
  code-bg:         #0f172a    (コード/パラメータ背景)
  dimmed-bg:       #131a2b    (グレーアウトカード背景)
  dimmed-stroke:   #1e293b    (グレーアウト枠線)

アクターカラー（プロトコルフロー用）:
  owner/user:      #a855f7    (紫 — リソース所有者/エンドユーザー)
  owner-light:     #d8b4fe    (テキスト用明るい紫)
  client:          #22d3ee    (シアン — クライアント/RPアプリ)
  client-light:    #67e8f9    (テキスト用明るいシアン)
  auth-server:     #f59e0b    (アンバー — 認可サーバー/IdP)
  auth-light:      #fcd34d    (テキスト用明るいアンバー)
  resource-server: #3b82f6    (青 — リソースサーバー)
  resource-light:  #93c5fd    (テキスト用明るい青)

チャネルカラー（矢印色）:
  user-action:     #a855f7    (紫 — ユーザー操作)
  front-channel:   #22d3ee    (シアン — フロントチャネル/ブラウザリダイレクト)
  auth-response:   #f59e0b    (アンバー — 認可サーバー応答)
  back-channel:    #22c55e    (緑 — バックチャネル/サーバー間通信)
  api-access:      #3b82f6    (青 — APIアクセス)

防御・セキュリティ:
  security:        #22c55e    (緑)
  security-light:  #86efac    (テキスト用)
  security-bg:     #052e16    (セキュリティカード背景)

共通:
  text-primary:    #f8fafc    (メインテキスト)
  text-secondary:  #e2e8f0    (見出し)
  text-muted:      #94a3b8    (説明文)
  text-dim:        #64748b    (補助テキスト/グレーアウトテキスト)
  text-dimmer:     #475569    (非アクティブステップテキスト)
  text-dimmest:    #334155    (グレーアウトラベル)
  border:          #334155    (ボーダー・区切り線)

ステップハイライト (サイドバー):
  active-bg:       各チャネル色 opacity="0.08"
  active-stroke:   各チャネル色 stroke-width="0.8"
  inactive-badge:  #334155    (非アクティブ番号バッジ)
```

### ライトテーマ

```
背景:
  bgGrad-start:    #f8fafc
  bgGrad-end:      #f1f5f9
  card-bg:         #ffffff
  panel-bg:        #f8fafc
  dimmed-bg:       #f1f5f9
  dimmed-stroke:   #e2e8f0

アクターカラー（やや濃く調整）:
  owner/user:      #7c3aed
  client:          #0891b2
  auth-server:     #d97706
  resource-server: #2563eb

共通:
  text-primary:    #0f172a
  text-secondary:  #1e293b
  text-muted:      #64748b
  border:          #cbd5e1
```

---

## タイポグラフィ

```
font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif
monospace:   'Fira Code', monospace

ヘッダータイトル:    font-size="24"  font-weight="700"
ヘッダーサブ:       font-size="13"  (text-muted)
RFCバッジ:         font-size="11"  font-weight="600"

Phaseバッジ:       font-size="15"  font-weight="700"
Phaseサブ:         font-size="12"

アクター名:         font-size="12"  font-weight="700"
アクターサブ:       font-size="8.5" opacity="0.7"

番号バッジ:         font-size="12"  font-weight="700" (白)
番号バッジ半径:     15px
番号バッジ色:       各チャネルカラー (fill)

ステップタイトル:    font-size="11"  font-weight="600"
パラメータコード:    font-size="9"   font-family="monospace"
説明ボックス角丸:   rx="6"

サイドバータイトル:  font-size="14"  font-weight="700"
サイドバーステップ:  font-size="10.5" font-weight="600"
サイドバー説明:     font-size="8.5" (channel-color)
サイドバーコード:   font-size="7.5" font-family="monospace" (text-dimmer)
サイドバーバッジ半径: 11px

凡例テキスト:       font-size="9"
セキュリティカード:  font-size="9.5" font-weight="600"
セキュリティ説明:   font-size="8"  (text-muted)

グレーアウトラベル:  font-size="10" (text-dimmest)
```

---

## 間隔・サイズ定数

### viewBox

```
幅: 1100px 固定
  図エリア:    0〜700px (左余白36px + アクター + 右余白)
  サイドバー:  740〜1080px (幅340px)

高さ計算:
  ヘッダー: 88px
  1 Phase: 720px (Phase badge 36 + actors + arrows + spacing)
  Phase区切り線: 0px (Phase間は同じ位置)
  合計: 88 + (Phase数 × 720) - 少し余白

  例: 4 Phase → viewBox="0 0 1100 3200"
  例: 3 Phase → viewBox="0 0 1100 2480"
  例: 2 Phase → viewBox="0 0 1100 1620"
```

### Phase内レイアウト

```
Phase badge: Y = base+0, X = 36
アクター上段: Y = base+70
アクター下段: Y = base+310
矢印/説明エリア: Y = base+70 〜 base+470

Phase区切り線:
  Y = 前Phase base + 708
  stroke-dasharray="8,8"  stroke="#334155"
  X: 36〜700
```

### アクターカード

```
幅: 110px  高さ: 130px  角丸: 12px
stroke-width: 1.6

2x2グリッド:
  左列: x=55   (カード左端)  → カード中心 x=110
  右列: x=530  (カード左端)  → カード中心 x=585
  上段: y=base+70  (カード上端)
  下段: y=base+310 (カード上端)

カード間:
  水平間隔: 530 - 55 - 110 = 365px (矢印・説明の空間)
  垂直間隔: 310 - 70 - 130 = 110px (矢印の空間)
```

### 矢印

```
stroke-width: 2.5

水平矢印 (上段同士 / 下段同士):
  上段: Y = base+115 (往路) / base+180 (復路)  → 65px間隔
  下段: Y = base+355 (往路) / base+420 (復路)
  X: 170 (左カード右端+5) 〜 524 (右カード左端-6)

垂直矢印 (左辺):
  X = 110 (左カード中央)
  Y: base+205 (上カード下端+5) 〜 base+305 (下カード上端-5)

斜め矢印 (左下 → 右上 / 右上 → 左下):
  往路: (170, base+345) → (524, base+155)
  復路: (524, base+195) → (170, base+345)
  ※往路と復路で Y offset をずらし重ならないこと

マーカー:
  markerWidth: 11  markerHeight: 7  refX: 10  refY: 3.5
```

### 説明ボックス

```
位置: 中央空間 (x: 195〜520 の範囲)
  上段矢印の説明: y = base+130付近 or base+290付近
  斜め矢印の説明: y = base+260付近 (中央)

サイズ: 幅 260〜290px, 高さ 30〜52px
背景: fill="#0f172a" stroke="#334155" opacity="0.92"
角丸: rx="6"

配置ルール:
  - アクターカード (x: 55-165, 530-640) と重ならないこと
  - 矢印パスと重なっても可（半透明背景で矢印が見える）
  - 番号バッジと重ならないこと
```

### サイドバー

```
位置: x=740  幅: 340px
Phase 1サイドバー高さ: 700px (ステップ一覧 + 凡例 + セキュリティ)
Phase 2-Nサイドバー高さ: 470px (ステップ一覧のみ)

タイトル: "全体フロー"  Y=28
区切り線: Y=40

ステップ一覧:
  非アクティブ: 30px間隔 (バッジ + テキスト1行)
  アクティブ:   36〜56px高さ (ハイライト背景 + テキスト2-3行)

凡例 (Phase 1のみ):
  区切り線後、2行×2列の凡例

セキュリティポイント (Phase 1のみ):
  高さ38pxのカード × N枚
```

---

## SVG defs テンプレート

全SVGの `<defs>` セクションに含める共通定義:

```xml
<defs>
  <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#0f172a"/>
    <stop offset="100%" stop-color="#1e293b"/>
  </linearGradient>
  <filter id="shadow">
    <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.35"/>
  </filter>
  <filter id="glow">
    <feGaussianBlur stdDeviation="2.5" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <!-- 矢印マーカー: 各チャネル色 -->
  <marker id="arrowPurple" markerWidth="11" markerHeight="7" refX="10" refY="3.5" orient="auto">
    <polygon points="0 0, 11 3.5, 0 7" fill="#a855f7"/>
  </marker>
  <marker id="arrowCyan" markerWidth="11" markerHeight="7" refX="10" refY="3.5" orient="auto">
    <polygon points="0 0, 11 3.5, 0 7" fill="#22d3ee"/>
  </marker>
  <marker id="arrowAmber" markerWidth="11" markerHeight="7" refX="10" refY="3.5" orient="auto">
    <polygon points="0 0, 11 3.5, 0 7" fill="#f59e0b"/>
  </marker>
  <marker id="arrowGreen" markerWidth="11" markerHeight="7" refX="10" refY="3.5" orient="auto">
    <polygon points="0 0, 11 3.5, 0 7" fill="#22c55e"/>
  </marker>
  <marker id="arrowBlue" markerWidth="11" markerHeight="7" refX="10" refY="3.5" orient="auto">
    <polygon points="0 0, 11 3.5, 0 7" fill="#3b82f6"/>
  </marker>
  <!-- アクターシンボル: references/svg-components.md に定義 -->
</defs>
```
