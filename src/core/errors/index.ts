/**
 * Custom error classes for the converter
 */

export class ConversionError extends Error {
  public code: string;
  public file?: string;
  public line?: number;
  public column?: number;
  public recoverable: boolean;

  constructor(
    message: string,
    code: string,
    options?: {
      file?: string;
      line?: number;
      column?: number;
      recoverable?: boolean;
    }
  ) {
    super(message);
    this.name = 'ConversionError';
    this.code = code;
    this.file = options?.file;
    this.line = options?.line;
    this.column = options?.column;
    this.recoverable = options?.recoverable ?? false;
  }
}

export class ValidationError extends ConversionError {
  constructor(message: string, code: string, options?: any) {
    super(message, `VALIDATION_${code}`, options);
    this.name = 'ValidationError';
  }
}

export class ParsingError extends ConversionError {
  constructor(message: string, code: string, options?: any) {
    super(message, `PARSING_${code}`, options);
    this.name = 'ParsingError';
  }
}

export class TransformationError extends ConversionError {
  constructor(message: string, code: string, options?: any) {
    super(message, `TRANSFORMATION_${code}`, options);
    this.name = 'TransformationError';
  }
}

export class ConfigurationError extends ConversionError {
  constructor(message: string, code: string, options?: any) {
    super(message, `CONFIG_${code}`, options);
    this.name = 'ConfigurationError';
  }
}

export class FileSystemError extends ConversionError {
  constructor(message: string, code: string, options?: any) {
    super(message, `FS_${code}`, options);
    this.name = 'FileSystemError';
  }
}
