# Building RHI Mobility UX

Requirements: Node.js 20 or newer.

```bash
npm ci
npm test
```

The build is deterministic from repository text sources and the exact source asset bytes under `src/assets/files/`.

Build flow:

```text
src/**
  ↓ tools/build.mjs
  ↓
dist/rhi-mobility-ux.js
```

The build order is explicit in `tools/build.mjs`; filesystem enumeration order is not used.

Before release, `npm test` must pass and the committed `dist/rhi-mobility-ux.js` must equal a clean rebuild.
