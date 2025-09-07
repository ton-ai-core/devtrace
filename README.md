# DevTrace

A comprehensive development toolkit for tracing, debugging, and monitoring JavaScript/TypeScript applications in the browser. DevTrace provides enhanced console logging with detailed stack traces, network monitoring, and variable inspection capabilities.

## Features

### 🔍 Enhanced Stack Logging
- **Call Stack Visualization**: Displays complete call stacks with file names, line numbers, and function names
- **Source Code Snippets**: Shows actual source code context around each stack frame
- **Variable Inspection**: Automatically captures and displays local variables at each call site
- **Smart Filtering**: Focuses on application code while filtering out framework internals

### 🌐 Network Monitoring
- **HTTP Request Tracing**: Monitors and logs all fetch() and XMLHttpRequest calls
- **Response Timing**: Tracks request duration and performance metrics
- **Request/Response Details**: Logs method, URL, status, headers, and body samples
- **Error Tracking**: Captures and reports network failures with timing information

### 📡 Message Tracing
- **PostMessage Monitoring**: Tracks inter-frame and worker communication
- **Message Content Logging**: Safely logs message payloads and origins
- **Bidirectional Tracking**: Monitors both incoming and outgoing messages

### 🔧 Function Tracing
- **Performance Monitoring**: Measures function execution time
- **Async Support**: Properly handles Promise-based functions
- **Error Tracking**: Captures and reports function-level exceptions
- **Custom Labels**: Allows custom naming for traced functions

## Installation

```bash
npm install devtrace
```

## Usage

### Basic Setup

```typescript
import { installStackLogger, installDevInstrumentation } from 'devtrace';

// Install enhanced console logging
installStackLogger({
  limit: 5,           // Show up to 5 stack frames
  skip: 0,           // Don't skip any frames
  snippet: 1,        // Show 1 line of code context
  preferApp: true,   // Prefer application code over framework code
  ascending: true    // Show root → call-site order
});

// Install network and message monitoring
installDevInstrumentation({
  network: true,     // Enable HTTP monitoring
  messages: true     // Enable PostMessage monitoring
});
```

### Stack Logger Options

```typescript
interface StackLoggerOptions {
  prefix?: string;        // Console prefix (default: '📞')
  skip?: number;          // Number of stack frames to skip
  limit?: number;         // Maximum frames to show
  mapSources?: boolean;   // Use source maps for better locations
  snippet?: number;       // Lines of code context to show
  onlyApp?: boolean;      // Show only application code
  preferApp?: boolean;    // Prefer app code when filtering
  appPattern?: RegExp;    // Pattern to identify app code (default: /src\//)
  meta?: boolean;         // Show debug configuration info
  ascending?: boolean;    // Frame order: true = root→call, false = call→root
}
```

### Variable Debugging

```typescript
import { dbg } from 'devtrace';

function myFunction() {
  const userData = { id: 1, name: 'John' };
  const isActive = true;
  
  // Variables will automatically appear in stack traces
  console.log('Processing user', dbg({ userData, isActive }));
}
```

### Function Tracing

```typescript
import { trace } from 'devtrace';

// Wrap functions to trace execution time and arguments
const tracedFunction = trace(async (userId: number) => {
  const user = await fetchUser(userId);
  return processUser(user);
}, 'getUserAndProcess');

// Usage remains the same
const result = await tracedFunction(123);
```

### Manual Context Tracking

```typescript
import { __TRACE } from 'devtrace';

function myFunction() {
  const frame = __TRACE.enter({
    fn: 'myFunction',
    file: 'example.ts',
    line: 10,
    col: 5,
    args: { param1: 'value' }
  });
  
  try {
    // Your function logic
    return result;
  } finally {
    __TRACE.leave(frame);
  }
}
```

## Example Output

DevTrace transforms your console output from simple messages to comprehensive debugging information:

```
📞 CALL STACK
  1. LaunchParamsPage.tsx:8:37 → LaunchParamsPage
     > 8 import * as RefreshRuntime from "/react-js-template/@react-refresh";
  2. LaunchParamsPage.tsx:40:17 → LaunchParamsPage
     > 40 console.log("writeInit1", dbg({
       41   "lp": lp
     Vars: {"lp": {...}}

Message Log: writeInit1

Vars: 
  lp: Object { 
    tgWebAppPlatform: "desktop", 
    tgWebAppVersion: "8.4", 
    tgWebAppData: {
      auth_date: "Sun Sep 07 2025 18:41:16 GMT+0400",
      hash: "some-hash",
      signature: "some-signature"
    },
    tgWebAppThemeParams: {
      accent_text_color: "#6abf2f",
      bg_color: "#17121b", 
      button_color: "#5288c1"
    }
  }
```

## Integration with Build Tools

### Babel Plugin Integration

DevTrace includes a Babel plugin that automatically instruments your code with tracing capabilities:

```javascript
// babel.config.js
module.exports = {
  plugins: [
    // ... other plugins
    './node_modules/devtrace/babel-plugin-function-frames.cjs'
  ]
};
```

This automatically:
- Adds `__TRACE.enter()` and `__TRACE.leave()` calls to functions
- Captures local variables and function arguments
- Appends variable context to console statements via `dbg()`

### TypeScript Support

DevTrace is written in TypeScript and provides complete type definitions. It supports:
- Full IntelliSense and autocomplete
- Type-safe configuration options  
- Generic function tracing with preserved return types

### Zone.js Integration

DevTrace automatically integrates with Zone.js when available, providing:
- Async context propagation across Promise chains
- Automatic stack frame correlation in async operations
- Support for Angular applications and other Zone.js environments

## Browser Compatibility

DevTrace works in all modern browsers that support:
- ES2015+ (modern JavaScript features)
- Fetch API and XMLHttpRequest
- PostMessage API
- Error.prototype.stack

## Performance Considerations

- **Development Only**: DevTrace should only be used in development environments
- **Lazy Loading**: Import DevTrace dynamically to avoid production bundles
- **Configurable Depth**: Limit stack trace depth to control performance impact
- **Source Map Caching**: Automatically caches fetched source files for performance

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.