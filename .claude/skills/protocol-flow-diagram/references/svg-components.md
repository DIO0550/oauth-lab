# SVG Components

Phase分割型プロトコルフロー図のSVGコンポーネント集。`<symbol>` で定義し `<use>` で再利用する。

## 目次

1. [アクターシンボル一覧](#アクターシンボル一覧)
2. [共通アクターシンボル](#共通アクターシンボル)
3. [プロトコル固有アクターシンボル](#プロトコル固有アクターシンボル)
4. [グレーアウトボックス](#グレーアウトボックス)
5. [矢印パターン](#矢印パターン)
6. [説明ボックス](#説明ボックス)
7. [サイドバーパターン](#サイドバーパターン)
8. [Phaseバッジ](#phaseバッジ)

---

## アクターシンボル一覧

| シンボルID | アイコン | 用途 |
|-----------|---------|------|
| `owner`   | 人物 + IDカード | リソース所有者 / エンドユーザー |
| `client`  | モニター + 歯車 | クライアント / RP / アプリケーション |
| `authsv`  | 盾 + 錠前 | 認可サーバー / IdP / OPサーバー |
| `ressv`   | サーバーラック + 錠前 | リソースサーバー / APIサーバー |
| `browser` | ブラウザウィンドウ | ブラウザ / User Agent |
| `database`| データベースシリンダー | 属性ストア / トークンストア |
| `dimbox`  | 破線ボックス | グレーアウト（非関連アクター） |

---

## 共通アクターシンボル

全シンボルは `viewBox="0 0 110 130"` で定義。`<use>` 時に `width="110" height="130"` を指定。

### owner（リソース所有者 / エンドユーザー）

```xml
<symbol id="owner" viewBox="0 0 110 130">
  <rect x="0" y="0" width="110" height="130" rx="12"
        fill="#1e1b2e" stroke="#a855f7" stroke-width="1.6"/>
  <g transform="translate(55, 32)">
    <circle cx="0" cy="-8" r="11" fill="none" stroke="#a855f7" stroke-width="1.5"/>
    <circle cx="-3" cy="-10" r="1.2" fill="#a855f7"/>
    <circle cx="3" cy="-10" r="1.2" fill="#a855f7"/>
    <path d="M-2.5,-4 Q0,-1 2.5,-4" fill="none" stroke="#a855f7"
          stroke-width="1" stroke-linecap="round"/>
    <path d="M-13,28 Q-13,10 0,6 Q13,10 13,28" fill="none"
          stroke="#a855f7" stroke-width="1.5"/>
    <line x1="-13" y1="28" x2="13" y2="28" stroke="#a855f7"
          stroke-width="1.5" stroke-linecap="round"/>
    <rect x="17" y="-18" width="20" height="14" rx="2" fill="none"
          stroke="#a855f7" stroke-width="0.8" opacity="0.5"/>
    <rect x="19" y="-16" width="5" height="5" rx="1" fill="#a855f7" opacity="0.3"/>
  </g>
  <text x="55" y="100" text-anchor="middle" fill="#d8b4fe"
        font-size="14" font-weight="700" font-family="'Segoe UI', sans-serif">
    リソース所有者</text>
  <text x="55" y="116" text-anchor="middle" fill="#a855f7"
        font-size="12" opacity="0.7" font-family="'Segoe UI', sans-serif">
    (Resource Owner)</text>
</symbol>
```

**ラベル変更**: ユーザー名を変更する場合は `<symbol>` 内のテキストを書き換えるか、`<use>` の後に `<text>` を重ねる。

### client（クライアント / RP）

```xml
<symbol id="client" viewBox="0 0 110 130">
  <rect x="0" y="0" width="110" height="130" rx="12"
        fill="#1e1b2e" stroke="#22d3ee" stroke-width="1.6"/>
  <g transform="translate(55, 34)">
    <rect x="-18" y="-16" width="36" height="26" rx="3" fill="none"
          stroke="#22d3ee" stroke-width="1.3"/>
    <rect x="-14" y="-12" width="28" height="18" rx="1"
          fill="#22d3ee" opacity="0.05"/>
    <circle cx="0" cy="-3" r="6.5" fill="none" stroke="#22d3ee" stroke-width="1"/>
    <circle cx="0" cy="-3" r="2.5" fill="none" stroke="#22d3ee" stroke-width="0.8"/>
    <line x1="0" y1="-11" x2="0" y2="-9.5" stroke="#22d3ee" stroke-width="1"/>
    <line x1="0" y1="3.5" x2="0" y2="5" stroke="#22d3ee" stroke-width="1"/>
    <line x1="-8" y1="-3" x2="-6.5" y2="-3" stroke="#22d3ee" stroke-width="1"/>
    <line x1="6.5" y1="-3" x2="8" y2="-3" stroke="#22d3ee" stroke-width="1"/>
    <line x1="0" y1="13" x2="0" y2="18" stroke="#22d3ee" stroke-width="1.3"/>
    <line x1="-9" y1="18" x2="9" y2="18" stroke="#22d3ee"
          stroke-width="1.3" stroke-linecap="round"/>
  </g>
  <text x="55" y="100" text-anchor="middle" fill="#67e8f9"
        font-size="14" font-weight="700" font-family="'Segoe UI', sans-serif">
    クライアント</text>
  <text x="55" y="116" text-anchor="middle" fill="#22d3ee"
        font-size="12" opacity="0.7" font-family="'Segoe UI', sans-serif">
    (Client)</text>
</symbol>
```

### authsv（認可サーバー / IdP）

```xml
<symbol id="authsv" viewBox="0 0 110 130">
  <rect x="0" y="0" width="110" height="130" rx="12"
        fill="#1e1b2e" stroke="#f59e0b" stroke-width="1.6"/>
  <g transform="translate(55, 32)">
    <path d="M0,-22 L14,-15 L14,1 Q14,14 0,20 Q-14,14 -14,1 L-14,-15 Z"
          fill="none" stroke="#f59e0b" stroke-width="1.4"/>
    <rect x="-6" y="-3" width="12" height="10" rx="2" fill="none"
          stroke="#f59e0b" stroke-width="1.2"/>
    <path d="M-3.5,-3 L-3.5,-7 Q-3.5,-12 0,-12 Q3.5,-12 3.5,-7 L3.5,-3"
          fill="none" stroke="#f59e0b" stroke-width="1.2"/>
    <circle cx="0" cy="2" r="1.5" fill="#f59e0b"/>
    <line x1="0" y1="3.5" x2="0" y2="6" stroke="#f59e0b" stroke-width="1.1"/>
  </g>
  <text x="55" y="100" text-anchor="middle" fill="#fcd34d"
        font-size="14" font-weight="700" font-family="'Segoe UI', sans-serif">
    認可サーバー</text>
  <text x="55" y="116" text-anchor="middle" fill="#f59e0b"
        font-size="12" opacity="0.7" font-family="'Segoe UI', sans-serif">
    (Auth Server)</text>
</symbol>
```

### ressv（リソースサーバー）

```xml
<symbol id="ressv" viewBox="0 0 110 130">
  <rect x="0" y="0" width="110" height="130" rx="12"
        fill="#1e1b2e" stroke="#3b82f6" stroke-width="1.6"/>
  <g transform="translate(55, 30)">
    <rect x="-18" y="-18" width="36" height="11" rx="2" fill="none"
          stroke="#3b82f6" stroke-width="1.2"/>
    <circle cx="-10" cy="-12.5" r="1.5" fill="#3b82f6"/>
    <circle cx="-5" cy="-12.5" r="1.5" fill="#3b82f6"/>
    <rect x="-18" y="-3" width="36" height="11" rx="2" fill="none"
          stroke="#3b82f6" stroke-width="1.2"/>
    <circle cx="-10" cy="2.5" r="1.5" fill="#3b82f6"/>
    <circle cx="-5" cy="2.5" r="1.5" fill="#3b82f6"/>
    <rect x="-18" y="12" width="36" height="11" rx="2" fill="none"
          stroke="#3b82f6" stroke-width="1.2"/>
    <circle cx="-10" cy="17.5" r="1.5" fill="#3b82f6"/>
    <circle cx="-5" cy="17.5" r="1.5" fill="#3b82f6"/>
    <g transform="translate(24, 8)">
      <rect x="-5" y="-2" width="10" height="7" rx="1.5" fill="#1e1b2e"
            stroke="#3b82f6" stroke-width="1"/>
      <path d="M-2.5,-2 L-2.5,-5 Q-2.5,-8 0,-8 Q2.5,-8 2.5,-5 L2.5,-2"
            fill="none" stroke="#3b82f6" stroke-width="1"/>
    </g>
  </g>
  <text x="55" y="100" text-anchor="middle" fill="#93c5fd"
        font-size="14" font-weight="700" font-family="'Segoe UI', sans-serif">
    リソースサーバー</text>
  <text x="55" y="116" text-anchor="middle" fill="#3b82f6"
        font-size="12" opacity="0.7" font-family="'Segoe UI', sans-serif">
    (Resource Server)</text>
</symbol>
```

---

## プロトコル固有アクターシンボル

必要に応じて追加定義する。ベースカラーとラベルを変更すれば他プロトコルに転用可能。

### browser（ブラウザ / User Agent）

カラー: `#22d3ee` (シアン) — client と同系色

```xml
<symbol id="browser" viewBox="0 0 110 130">
  <rect x="0" y="0" width="110" height="130" rx="12"
        fill="#1e1b2e" stroke="#22d3ee" stroke-width="1.6"/>
  <g transform="translate(55, 30)">
    <rect x="-22" y="-18" width="44" height="36" rx="3" fill="none"
          stroke="#22d3ee" stroke-width="1.3"/>
    <!-- title bar -->
    <line x1="-22" y1="-10" x2="22" y2="-10" stroke="#22d3ee" stroke-width="0.8"/>
    <circle cx="-16" cy="-14" r="1.5" fill="#ef4444"/>
    <circle cx="-10" cy="-14" r="1.5" fill="#f59e0b"/>
    <circle cx="-4" cy="-14" r="1.5" fill="#22c55e"/>
    <!-- address bar -->
    <rect x="-18" y="-8" width="36" height="5" rx="1" fill="#22d3ee" opacity="0.08"/>
    <!-- content lines -->
    <line x1="-16" y1="0" x2="16" y2="0" stroke="#22d3ee" stroke-width="0.8" opacity="0.3"/>
    <line x1="-16" y1="5" x2="10" y2="5" stroke="#22d3ee" stroke-width="0.8" opacity="0.3"/>
    <line x1="-16" y1="10" x2="14" y2="10" stroke="#22d3ee" stroke-width="0.8" opacity="0.3"/>
  </g>
  <text x="55" y="100" text-anchor="middle" fill="#67e8f9"
        font-size="14" font-weight="700" font-family="'Segoe UI', sans-serif">
    ブラウザ</text>
  <text x="55" y="116" text-anchor="middle" fill="#22d3ee"
        font-size="12" opacity="0.7" font-family="'Segoe UI', sans-serif">
    (User Agent)</text>
</symbol>
```

### database（属性ストア / トークンストア）

カラー: `#8b5cf6` (紫系)

```xml
<symbol id="database" viewBox="0 0 110 130">
  <rect x="0" y="0" width="110" height="130" rx="12"
        fill="#1e1b2e" stroke="#8b5cf6" stroke-width="1.6"/>
  <g transform="translate(55, 32)">
    <ellipse cx="0" cy="-14" rx="18" ry="6" fill="none"
             stroke="#8b5cf6" stroke-width="1.3"/>
    <path d="M-18,-14 L-18,14" stroke="#8b5cf6" stroke-width="1.3"/>
    <path d="M18,-14 L18,14" stroke="#8b5cf6" stroke-width="1.3"/>
    <ellipse cx="0" cy="14" rx="18" ry="6" fill="none"
             stroke="#8b5cf6" stroke-width="1.3"/>
    <ellipse cx="0" cy="0" rx="18" ry="6" fill="none"
             stroke="#8b5cf6" stroke-width="0.8" opacity="0.4"/>
  </g>
  <text x="55" y="100" text-anchor="middle" fill="#c4b5fd"
        font-size="14" font-weight="700" font-family="'Segoe UI', sans-serif">
    属性ストア</text>
  <text x="55" y="116" text-anchor="middle" fill="#8b5cf6"
        font-size="12" opacity="0.7" font-family="'Segoe UI', sans-serif">
    (Attribute Store)</text>
</symbol>
```

---

## グレーアウトボックス

非関連アクターに使用。カード外側にラベルテキストを追加する。

```xml
<symbol id="dimbox" viewBox="0 0 110 130">
  <rect x="0" y="0" width="110" height="130" rx="12"
        fill="#131a2b" stroke="#1e293b" stroke-width="1" stroke-dasharray="5,4"/>
</symbol>

<!-- 使用例 -->
<use href="#dimbox" x="530" y="310" width="110" height="130"/>
<text x="585" y="385" text-anchor="middle" fill="#334155"
      font-size="12" font-family="'Segoe UI', sans-serif">リソースサーバー</text>
```

---

## 矢印パターン

### 水平矢印（上段同士）

```xml
<!-- 左→右 (往路) -->
<path d="M 170 {base+115} L 524 {base+115}" fill="none"
      stroke="{channel-color}" stroke-width="2.5"
      marker-end="url(#arrow{Target})"/>

<!-- 右→左 (復路) — Y を +65 してずらす -->
<path d="M 524 {base+180} L 170 {base+180}" fill="none"
      stroke="{channel-color}" stroke-width="2.5" stroke-dasharray="8,4"
      marker-end="url(#arrow{Target})"/>
```

### 斜め矢印（左下 → 右上）

```xml
<!-- クライアント → 認可サーバー (右上斜め) -->
<path d="M 170 {base+345} L 524 {base+155}" fill="none"
      stroke="{channel-color}" stroke-width="2.5" stroke-dasharray="9,4"
      marker-end="url(#arrow{Target})" filter="url(#glow)"/>

<!-- 認可サーバー → クライアント (左下斜め) -->
<path d="M 524 {base+195} L 170 {base+345}" fill="none"
      stroke="{channel-color}" stroke-width="2.5"
      marker-end="url(#arrow{Target})"/>
```

### 垂直矢印（左辺）

```xml
<path d="M 110 {base+205} L 110 {base+305}" fill="none"
      stroke="#a855f7" stroke-width="2.5"
      marker-end="url(#arrowCyan)"/>
```

### 番号バッジ

```xml
<!-- 矢印に付随する番号 -->
<circle cx="{x}" cy="{y}" r="15" fill="{channel-color}"/>
<text x="{x}" y="{y+5}" text-anchor="middle" fill="#fff"
      font-size="13" font-weight="700" font-family="'Segoe UI', sans-serif">
  {step_number}</text>
```

---

## 説明ボックス

矢印近くに配置するパラメータ/コード表示。

```xml
<g transform="translate({x}, {y})">
  <rect x="-6" y="-14" width="{w}" height="{h}" rx="6"
        fill="#0f172a" stroke="#334155" stroke-width="1" opacity="0.92"/>
  <text x="6" y="2" fill="{channel-color-light}" font-size="13"
        font-weight="600" font-family="'Segoe UI', sans-serif">
    {step_label}</text>
  <text x="6" y="18" fill="#94a3b8" font-size="12"
        font-family="'Fira Code', monospace">
    {param_line_1}</text>
  <text x="6" y="32" fill="#94a3b8" font-size="12"
        font-family="'Fira Code', monospace">
    {param_line_2}</text>
</g>
```

---

## サイドバーパターン

### 非アクティブステップ

```xml
<circle cx="30" cy="{y}" r="11" fill="#334155"/>
<text x="30" y="{y+5}" text-anchor="middle" fill="#64748b"
      font-size="12" font-weight="700">{N}</text>
<text x="48" y="{y+4}" fill="#64748b" font-size="12"
      font-family="'Segoe UI', sans-serif">{step_title}</text>
```

### アクティブステップ

```xml
<rect x="12" y="{y_top}" width="316" height="{h}" rx="6"
      fill="{channel-color}" opacity="0.08"
      stroke="{channel-color}" stroke-width="0.8"/>
<circle cx="30" cy="{y}" r="11" fill="{channel-color}"/>
<text x="30" y="{y+5}" text-anchor="middle" fill="#fff"
      font-size="12" font-weight="700">{N}</text>
<text x="48" y="{y-2}" fill="#f8fafc" font-size="12"
      font-weight="600" font-family="'Segoe UI', sans-serif">{step_title}</text>
<text x="48" y="{y+12}" fill="{channel-color-light}" font-size="12"
      font-family="'Segoe UI', sans-serif">{step_description}</text>
<text x="48" y="{y+24}" fill="#475569" font-size="12"
      font-family="'Fira Code', monospace">{code_example}</text>
```

---

## Phaseバッジ

```xml
<rect x="36" y="{base}" width="{w}" height="36" rx="8"
      fill="{phase-color}" opacity="0.08"
      stroke="{phase-color}" stroke-width="1"/>
<text x="56" y="{base+24}" fill="{phase-color-light}"
      font-size="16" font-weight="700" font-family="'Segoe UI', sans-serif">
  Phase {N}</text>
<text x="136" y="{base+24}" fill="{phase-color-light}"
      font-size="13" font-family="'Segoe UI', sans-serif">
  {phase_title}</text>
```

Phase カラー:
- Phase 1: `#22d3ee` (シアン)
- Phase 2: `#f59e0b` (アンバー)
- Phase 3: `#22c55e` (緑)
- Phase 4: `#3b82f6` (青)
- Phase 5+: `#8b5cf6` (紫)
