/**
 * Structured logging utility for consistent logging across the application
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMetadata {
  [key: string]: any;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  error?: string;
  stack?: string;
  [key: string]: any;
}

/**
 * Formats a log entry as JSON for structured logging
 */
function formatLogEntry(
  level: LogLevel,
  message: string,
  meta?: LogMetadata
): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };
}

/**
 * Simple structured logger for server and API
 *
 * Outputs JSON-formatted logs that can be easily parsed
 * and searched in production environments.
 *
 * @example
 * logger.info('Analysis completed', { url: 'example.com', duration: 1234 });
 * logger.error('Failed to fetch URL', error, { url: 'example.com' });
 */
export const logger = {
  /**
   * Log informational message
   * @param message - Log message
   * @param meta - Optional metadata object
   */
  info: (message: string, meta?: LogMetadata) => {
    const entry = formatLogEntry('info', message, meta);
    console.log(JSON.stringify(entry));
  },

  /**
   * Log warning message
   * @param message - Warning message
   * @param meta - Optional metadata object
   */
  warn: (message: string, meta?: LogMetadata) => {
    const entry = formatLogEntry('warn', message, meta);
    console.warn(JSON.stringify(entry));
  },

  /**
   * Log error message
   * @param message - Error message
   * @param error - Optional Error object
   * @param meta - Optional metadata object
   */
  error: (message: string, error?: Error, meta?: LogMetadata) => {
    const entry = formatLogEntry('error', message, {
      ...meta,
      error: error?.message,
      stack: error?.stack,
    });
    console.error(JSON.stringify(entry));
  },

  /**
   * Log debug message (only in development)
   * @param message - Debug message
   * @param meta - Optional metadata object
   */
  debug: (message: string, meta?: LogMetadata) => {
    if (process.env.NODE_ENV === 'development') {
      const entry = formatLogEntry('debug', message, meta);
      console.debug(JSON.stringify(entry));
    }
  },
};
