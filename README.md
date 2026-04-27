# H Performance — Next.js

Site institucional da H Performance, servido como **componentes React** via Next.js + `html-react-parser` em cima de um snapshot HTML/CSS.

## Como rodar

```bash
npm run dev
# abre http://localhost:3000/
```

A home (`/`) renderiza um único componente `SiteBody` que parseia o snapshot completo em árvore React.

```
src/app/page.tsx
└── <SiteBody />        ← parseia src/snapshot/body.ts
```

## Como editar textos

1. Edite `content.json` na raiz (cada chave é um texto da página).
2. Rode:
   ```bash
   npm run patch
   ```
   Isso aplica o conteúdo ao snapshot E regenera os módulos.
3. Recarregue `localhost:3000`.

## Como trocar imagens

Imagens estão em `public/images/`. Mapeamento:

| Arquivo | Onde aparece |
|---|---|
| `Logo_white.png` | Logo H no header |
| `img-2-4eb28f8ec7.png` + `img-4-31406c551a.avif` | Hero (Nova York) |
| `img-5-11ccbc5aea.png` + `img-6-cc8ebe5e73.avif` | Middle CTA (Toronto) |
| `img-7-d30a20f305.png` + `img-8-48b94a81b0.avif` | Solutions (Manhattan Bridge) |
| `instagram.svg` / `facebook.svg` / `linkedin.svg` | Ícones do footer |

Pra trocar: sobrescreva o arquivo com o mesmo nome (ou edite `public/replica.html` e `src/snapshot/body.ts` se for trocar o caminho).

## Estrutura

```
h-performance/
├── content.json                ← edite aqui (textos)
├── public/
│   ├── replica.html            ← snapshot patchado (gerado)
│   └── images/                 ← imagens (sobrescreva)
├── replica.template.html       ← template com {{placeholders}}
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css         ← overrides de marca H (cores/hover/header)
│   ├── components/
│   │   ├── SiteAnimations.tsx  ← entrance + scroll reveal (Motion)
│   │   └── sections/SiteBody.tsx
│   └── snapshot/               ← gerado por split-snapshot.mjs
│       ├── styles.css
│       └── body.ts
└── scripts/
    ├── apply-brand.mjs         ← aplica paleta/fontes/textos H (1x)
    ├── patch-content.mjs       ← gera public/replica.html
    ├── split-snapshot.mjs      ← gera src/snapshot/*
    ├── swap-logo.mjs           ← injeta Logo_white.png
    └── swap-videos.mjs         ← troca <video> por <img>
```
