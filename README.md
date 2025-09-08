# Devtrace

Example console output:

```log
📞 CALL STACK
  1. init.ts:20:8 → init
        19         initSDK();
      > 20         // Add Eruda if needed.
        21         if (options.eruda) {
     Vars: {"options":{"debug":true,"eruda":false,"mockForMacOS":false}}
  2. @ton-ai-core_devtrace.js?v=47b4a8f4:388:24 → installStackLogger/console[m]
        387     console[m] = (...args) => {
      > 388       const captured = new Error();
        389       const dataSnap = __TRACE.stack();

Message Log: testvalue 
Vars: 
Object { options: {…} }
​
options: Object { debug: true, eruda: false, mockForMacOS: false }
````

---

## Installation

```bash
npm install @ton-ai-core/devtrace
```

---

## Usage

Add to your entry point (`src/index.tsx`) — enabled only in dev mode:

```ts
if (import.meta.env.DEV) {
  await import('@ton-ai-core/devtrace')
    .then(m => m.installStackLogger({
      limit: 5,        // number of stack frames
      skip: 0,         // skip frames
      tail: false,     // show full stack, not only tail
      ascending: true, // order root → call-site
      mapSources: true,// map sources to original files
      snippet: 1,      // lines of code context
      preferApp: true, // prioritize app code
      onlyApp: false   // include libs as well
    }))
    .catch(() => {});

  await import('@ton-ai-core/devtrace')
    .then(m => m.installDevInstrumentation())
    .catch(() => {});
}
```

Configure Babel plugin in `vite.config.ts` (dev only):

```ts
import functionFrames from '@ton-ai-core/devtrace/babel-plugin';

mode === 'development' && viteBabel({
  filter: (id: string) => {
    if (!/[.][tj]sx?$/.test(id)) return false;
    if (id.includes('/node_modules/')) return false;
    if (!id.includes('/src/')) return false;
    if (id.includes('/src/devtools/')) return false;
    if (id.includes('/src/trace-context')) return false;
    if (id.endsWith('/src/index.tsx')) return false;
    if (id.endsWith('/src/mockEnv.ts')) return false;
    return true;
  },
  babelConfig: {
    presets: [["@babel/preset-typescript", { isTSX: true, allExtensions: true }]],
    plugins: [functionFrames]
  }
})
```
