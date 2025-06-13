"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const errors_1 = require("src/core/errors");
const IProgressReporter_1 = require("src/core/interfaces/IProgressReporter");
(0, vitest_1.describe)('Error Classes', () => {
    (0, vitest_1.describe)('ConversionError', () => {
        (0, vitest_1.it)('should create error with basic properties', () => {
            const error = new errors_1.ConversionError('Test error', 'TEST_CODE');
            (0, vitest_1.expect)(error).toBeInstanceOf(Error);
            (0, vitest_1.expect)(error).toBeInstanceOf(errors_1.ConversionError);
            (0, vitest_1.expect)(error.message).toBe('Test error');
            (0, vitest_1.expect)(error.code).toBe('TEST_CODE');
            (0, vitest_1.expect)(error.name).toBe('ConversionError');
            (0, vitest_1.expect)(error.recoverable).toBe(false);
        });
        (0, vitest_1.it)('should accept optional properties', () => {
            const error = new errors_1.ConversionError('Test error', 'TEST_CODE', {
                file: 'test.js',
                line: 10,
                column: 5,
                recoverable: true
            });
            (0, vitest_1.expect)(error.file).toBe('test.js');
            (0, vitest_1.expect)(error.line).toBe(10);
            (0, vitest_1.expect)(error.column).toBe(5);
            (0, vitest_1.expect)(error.recoverable).toBe(true);
        });
    });
    (0, vitest_1.describe)('ValidationError', () => {
        (0, vitest_1.it)('should prefix code with VALIDATION_', () => {
            const error = new errors_1.ValidationError('Validation failed', 'SYNTAX');
            (0, vitest_1.expect)(error).toBeInstanceOf(errors_1.ValidationError);
            (0, vitest_1.expect)(error).toBeInstanceOf(errors_1.ConversionError);
            (0, vitest_1.expect)(error.code).toBe('VALIDATION_SYNTAX');
            (0, vitest_1.expect)(error.name).toBe('ValidationError');
        });
    });
    (0, vitest_1.describe)('ParsingError', () => {
        (0, vitest_1.it)('should prefix code with PARSING_', () => {
            const error = new errors_1.ParsingError('Parse failed', 'SYNTAX_ERROR');
            (0, vitest_1.expect)(error).toBeInstanceOf(errors_1.ParsingError);
            (0, vitest_1.expect)(error).toBeInstanceOf(errors_1.ConversionError);
            (0, vitest_1.expect)(error.code).toBe('PARSING_SYNTAX_ERROR');
            (0, vitest_1.expect)(error.name).toBe('ParsingError');
        });
    });
    (0, vitest_1.describe)('TransformationError', () => {
        (0, vitest_1.it)('should prefix code with TRANSFORMATION_', () => {
            const error = new errors_1.TransformationError('Transform failed', 'UNSUPPORTED');
            (0, vitest_1.expect)(error).toBeInstanceOf(errors_1.TransformationError);
            (0, vitest_1.expect)(error).toBeInstanceOf(errors_1.ConversionError);
            (0, vitest_1.expect)(error.code).toBe('TRANSFORMATION_UNSUPPORTED');
            (0, vitest_1.expect)(error.name).toBe('TransformationError');
        });
    });
    (0, vitest_1.describe)('ConfigurationError', () => {
        (0, vitest_1.it)('should prefix code with CONFIG_', () => {
            const error = new errors_1.ConfigurationError('Config invalid', 'INVALID_FORMAT');
            (0, vitest_1.expect)(error).toBeInstanceOf(errors_1.ConfigurationError);
            (0, vitest_1.expect)(error).toBeInstanceOf(errors_1.ConversionError);
            (0, vitest_1.expect)(error.code).toBe('CONFIG_INVALID_FORMAT');
            (0, vitest_1.expect)(error.name).toBe('ConfigurationError');
        });
    });
    (0, vitest_1.describe)('FileSystemError', () => {
        (0, vitest_1.it)('should prefix code with FS_', () => {
            const error = new errors_1.FileSystemError('File not found', 'NOT_FOUND');
            (0, vitest_1.expect)(error).toBeInstanceOf(errors_1.FileSystemError);
            (0, vitest_1.expect)(error).toBeInstanceOf(errors_1.ConversionError);
            (0, vitest_1.expect)(error.code).toBe('FS_NOT_FOUND');
            (0, vitest_1.expect)(error.name).toBe('FileSystemError');
        });
    });
    (0, vitest_1.describe)('Type Guards', () => {
        (0, vitest_1.it)('should correctly identify ConversionError', () => {
            const conversionError = new errors_1.ConversionError('Test', 'CODE');
            const regularError = new Error('Test');
            (0, vitest_1.expect)((0, IProgressReporter_1.isConversionError)(conversionError)).toBe(true);
            (0, vitest_1.expect)((0, IProgressReporter_1.isConversionError)(regularError)).toBe(false);
            (0, vitest_1.expect)((0, IProgressReporter_1.isConversionError)(null)).toBe(false);
            (0, vitest_1.expect)((0, IProgressReporter_1.isConversionError)(undefined)).toBe(false);
        });
        (0, vitest_1.it)('should correctly identify ValidationError', () => {
            const validationError = new errors_1.ValidationError('Test', 'CODE');
            const conversionError = new errors_1.ConversionError('Test', 'CODE');
            (0, vitest_1.expect)((0, IProgressReporter_1.isValidationError)(validationError)).toBe(true);
            (0, vitest_1.expect)((0, IProgressReporter_1.isValidationError)(conversionError)).toBe(false);
        });
        (0, vitest_1.it)('should correctly identify ParsingError', () => {
            const parsingError = new errors_1.ParsingError('Test', 'CODE');
            const conversionError = new errors_1.ConversionError('Test', 'CODE');
            (0, vitest_1.expect)((0, IProgressReporter_1.isParsingError)(parsingError)).toBe(true);
            (0, vitest_1.expect)((0, IProgressReporter_1.isParsingError)(conversionError)).toBe(false);
        });
    });
});
//# sourceMappingURL=errors.test.js.map
