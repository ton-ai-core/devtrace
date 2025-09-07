// Import types to ensure global augmentation is processed
import './types';

// Export all public APIs
export { trace, type AnyFunc } from './trace';
export { dbg, isDebugVars, type DebugVarsObject, DBG_VARS } from './dbg';
export { installDevInstrumentation } from './dev-instrumentation';
export { installStackLogger } from './stack-logger';
export { __TRACE, type Frame } from './trace-context';

// Define InstallOpts type for export
export type InstallOpts = {
  network?: boolean;
  messages?: boolean;
};