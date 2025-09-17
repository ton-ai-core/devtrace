export {};

declare global {
  interface Window {
    __stackLoggerSilence__?: boolean;
    __devtraceEnableNetworkLogging__?: boolean;
    __devtraceEnableTraceLogging__?: boolean;
    __devtraceEnableMessageLogging__?: boolean;
  }
}