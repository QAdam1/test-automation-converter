import {describe, expect, it} from 'vitest';
import {
    ConfigurationError,
    ConversionError,
    FileSystemError,
    ParsingError,
    TransformationError,
    ValidationError
} from '@/core/errors';
import {isConversionError, isParsingError, isValidationError} from "@/core/interfaces/IProgressReporter";

describe('Error Classes', () => {
  describe('ConversionError', () => {
    it('should create error with basic properties', () => {
      const error = new ConversionError('Test error', 'TEST_CODE');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ConversionError);
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.name).toBe('ConversionError');
      expect(error.recoverable).toBe(false);
    });

    it('should accept optional properties', () => {
      const error = new ConversionError('Test error', 'TEST_CODE', {
        file: 'test.js',
        line: 10,
        column: 5,
        recoverable: true
      });

      expect(error.file).toBe('test.js');
      expect(error.line).toBe(10);
      expect(error.column).toBe(5);
      expect(error.recoverable).toBe(true);
    });
  });

  describe('ValidationError', () => {
    it('should prefix code with VALIDATION_', () => {
      const error = new ValidationError('Validation failed', 'SYNTAX');

      expect(error).toBeInstanceOf(ValidationError);
      expect(error).toBeInstanceOf(ConversionError);
      expect(error.code).toBe('VALIDATION_SYNTAX');
      expect(error.name).toBe('ValidationError');
    });
  });

  describe('ParsingError', () => {
    it('should prefix code with PARSING_', () => {
      const error = new ParsingError('Parse failed', 'SYNTAX_ERROR');

      expect(error).toBeInstanceOf(ParsingError);
      expect(error).toBeInstanceOf(ConversionError);
      expect(error.code).toBe('PARSING_SYNTAX_ERROR');
      expect(error.name).toBe('ParsingError');
    });
  });

  describe('TransformationError', () => {
    it('should prefix code with TRANSFORMATION_', () => {
      const error = new TransformationError('Transform failed', 'UNSUPPORTED');

      expect(error).toBeInstanceOf(TransformationError);
      expect(error).toBeInstanceOf(ConversionError);
      expect(error.code).toBe('TRANSFORMATION_UNSUPPORTED');
      expect(error.name).toBe('TransformationError');
    });
  });

  describe('ConfigurationError', () => {
    it('should prefix code with CONFIG_', () => {
      const error = new ConfigurationError('Config invalid', 'INVALID_FORMAT');

      expect(error).toBeInstanceOf(ConfigurationError);
      expect(error).toBeInstanceOf(ConversionError);
      expect(error.code).toBe('CONFIG_INVALID_FORMAT');
      expect(error.name).toBe('ConfigurationError');
    });
  });

  describe('FileSystemError', () => {
    it('should prefix code with FS_', () => {
      const error = new FileSystemError('File not found', 'NOT_FOUND');

      expect(error).toBeInstanceOf(FileSystemError);
      expect(error).toBeInstanceOf(ConversionError);
      expect(error.code).toBe('FS_NOT_FOUND');
      expect(error.name).toBe('FileSystemError');
    });
  });

  describe('Type Guards', () => {
    it('should correctly identify ConversionError', () => {
      const conversionError = new ConversionError('Test', 'CODE');
      const regularError = new Error('Test');

      expect(isConversionError(conversionError)).toBe(true);
      expect(isConversionError(regularError)).toBe(false);
      expect(isConversionError(null)).toBe(false);
      expect(isConversionError(undefined)).toBe(false);
    });

    it('should correctly identify ValidationError', () => {
      const validationError = new ValidationError('Test', 'CODE');
      const conversionError = new ConversionError('Test', 'CODE');

      expect(isValidationError(validationError)).toBe(true);
      expect(isValidationError(conversionError)).toBe(false);
    });

    it('should correctly identify ParsingError', () => {
      const parsingError = new ParsingError('Test', 'CODE');
      const conversionError = new ConversionError('Test', 'CODE');

      expect(isParsingError(parsingError)).toBe(true);
      expect(isParsingError(conversionError)).toBe(false);
    });
  });
});
