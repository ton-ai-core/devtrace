// Stacktrace.js types
declare module 'stacktrace-js' {
  export interface StackFrame {
    fileName?: string;
    lineNumber?: number;
    columnNumber?: number;
    functionName?: string;
  }
  const StackTrace: {
    fromError(error: Error, opts?: unknown): Promise<StackFrame[]>;
    get(opts?: unknown): Promise<StackFrame[]>;
  };
  export default StackTrace;
}

// Error stack parser types
declare module 'error-stack-parser-es/lite' {
  export interface ParsedFrame {
    file?: string;
    line?: number;
    col?: number;
    name?: string;
  }
  export function parse(err: unknown): ParsedFrame[];
}