# Devtrace

Example console output:

```log
📞 CALL STACK
  1. HomePage.tsx:224:21 → HomePage/pagedItems<
        223       const allSorted = sortedIndices.map(index => filteredData.finalFiltered[index]);
      > 224       debugSortOrder(allSorted);
        225     }
  2. debugSort.ts:4:24 → debugSortOrder
        3   console.log("=== DEBUG SORT ORDER ===");
      > 4   plugins.slice(0, 10).forEach((plugin, index) => {
        5     const createdTimestamp = getPluginTimestamp(plugin, "created");
  3. debugSort.ts:12:13 → debugSortOrder/<
        11     console.log(`   Indexed_at: ${plugin.indexed_at}`);
      > 12     console.log(`   Commits: ${plugin.commits ? "Available" : "N/A"}`);
        13     console.log("---");

Message Log:    Commits: N/A
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
