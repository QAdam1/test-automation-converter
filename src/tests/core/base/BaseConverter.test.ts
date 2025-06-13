import {beforeEach, describe, expect, it, vi} from 'vitest';
import {BaseConverter} from '@/core/base/BaseConverter';
import {ConversionOptions, ConversionPlan, ConversionResult, ProgressEvent, ValidationResult,} from '@/core/types';

// Mock implementation for testing
class TestConverter extends BaseConverter {
  async analyze(): Promise<ConversionPlan> {
    return {
      files: [],
      estimatedDuration: 1000,
      requiredDiskSpace: 1024,
      potentialIssues: [],
      configChanges: [],
    };
  }
  async transform(_plan: ConversionPlan): Promise<ConversionResult> {
    return {
      success: true,
      processedFiles: [],
      skippedFiles: [],
      errors: this.errors,
      duration: 0,
      warnings: this.warnings,
      stats: this.createEmptyStats(),
    };
  }

  async validate(_plan: ConversionPlan): Promise<ValidationResult> {
    return {
      valid: true,
      errors: [],
      warnings: [],
    };
  }
}

describe('BaseConverter', () => {
  let converter: TestConverter;
  let options: ConversionOptions;

  beforeEach(() => {
    options = {
      source: '/test/source',
      target: '/test/target',
    };
    converter = new TestConverter(options);
  });

  describe('constructor', () => {
    it('should normalize options with defaults', () => {
      const normalizedOptions = (converter as any).options;

      expect(normalizedOptions.dryRun).toBe(false);
      expect(normalizedOptions.backup).toBe(true);
      expect(normalizedOptions.backupDir).toBe('.backup');
      expect(normalizedOptions.preserveStructure).toBe(true);
      expect(normalizedOptions.interactive).toBe(false);
      expect(normalizedOptions.verbose).toBe(false);
      expect(normalizedOptions.concurrency).toBe(5);
      expect(normalizedOptions.include).toEqual(['**/*']);
      expect(normalizedOptions.exclude).toEqual(['**/node_modules/**', '**/.git/**']);
    });

    it('should preserve provided options', () => {
      const customOptions: ConversionOptions = {
        source: '/test/source',
        dryRun: true,
        backup: false,
        concurrency: 10,
      };

      const customConverter = new TestConverter(customOptions);
      const normalizedOptions = (customConverter as any).options;

      expect(normalizedOptions.dryRun).toBe(true);
      expect(normalizedOptions.backup).toBe(false);
      expect(normalizedOptions.concurrency).toBe(10);
    });
  });

  describe('convert', () => {
    it('should execute conversion pipeline successfully', async () => {
      const result = await converter.convert();

      expect(result.success).toBe(true);
      expect(result.processedFiles).toEqual([]);
      expect(result.errors).toEqual([]);
      expect(result.duration).toBeGreaterThan(0);
    });

    it('should emit progress events', async () => {
      const progressEvents: ProgressEvent[] = [];
      converter.onProgress(event => progressEvents.push(event));

      await converter.convert();

      expect(progressEvents.length).toBeGreaterThan(0);
      expect(progressEvents[0].phase).toBe('analysis');
      expect(progressEvents[0].progress).toBe(0);
      expect(progressEvents.find(e => e.phase === 'transformation')).toBeDefined();
      expect(progressEvents.find(e => e.phase === 'validation')).toBeDefined();
    });

    it('should handle validation failure', async () => {
      const failingConverter = new (class extends TestConverter {
        async validate(): Promise<ValidationResult> {
          return {
            valid: false,
            errors: [
              {
                type: 'syntax',
                message: 'Invalid syntax',
                file: 'test.js',
              },
            ],
            warnings: [],
          };
        }
      })(options);

      const result = await failingConverter.convert();

      expect(result.success).toBe(false);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0].code).toBe('VALIDATION_SYNTAX');
      expect(result.errors[0].message).toBe('Invalid syntax');
    });

    it('should handle conversion errors', async () => {
      const errorConverter = new (class extends TestConverter {
        async transform(): Promise<ConversionResult> {
          throw new Error('Transformation failed');
        }
      })(options);

      const result = await errorConverter.convert();

      expect(result.success).toBe(false);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0].code).toBe('CONVERSION_FAILED');
      expect(result.errors[0].message).toBe('Transformation failed');
    });
  });

  describe('progress listeners', () => {
    it('should add and remove progress listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      converter.onProgress(listener1);
      converter.onProgress(listener2);

      (converter as any).emitProgress({
        phase: 'analysis',
        progress: 50,
        message: 'Test',
      });

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);

      converter.offProgress(listener1);

      (converter as any).emitProgress({
        phase: 'analysis',
        progress: 100,
        message: 'Test 2',
      });

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(2);
    });
  });

  describe('error and warning management', () => {
    it('should add errors', () => {
      (converter as any).addError({
        code: 'TEST_ERROR',
        message: 'Test error',
      });

      expect((converter as any).errors.length).toBe(1);
      expect((converter as any).errors[0].code).toBe('TEST_ERROR');
      expect((converter as any).errors[0].recoverable).toBe(false);
    });

    it('should add warnings', () => {
      (converter as any).addWarning({
        code: 'TEST_WARNING',
        message: 'Test warning',
      });

      expect((converter as any).warnings.length).toBe(1);
      expect((converter as any).warnings[0].code).toBe('TEST_WARNING');
    });
  });

  describe('shouldProcessFile', () => {
    it('should include files by default', () => {
      expect((converter as any).shouldProcessFile('src/index.js')).toBe(true);
      expect((converter as any).shouldProcessFile('test/spec.js')).toBe(true);
    });

    it('should exclude node_modules by default', () => {
      expect((converter as any).shouldProcessFile('node_modules/package/index.js')).toBe(false);
      expect((converter as any).shouldProcessFile('src/node_modules/local.js')).toBe(false);
    });

    it('should exclude .git by default', () => {
      expect((converter as any).shouldProcessFile('.git/config')).toBe(false);
      expect((converter as any).shouldProcessFile('src/.git/hooks')).toBe(false);
    });

    it('should respect custom include/exclude patterns', () => {
      const customConverter = new TestConverter({
        source: '/test',
        include: ['src/**/*.js'],
        exclude: ['**/*.test.js'],
      });

      expect((customConverter as any).shouldProcessFile('src/index.js')).toBe(true);
      expect((customConverter as any).shouldProcessFile('src/index.test.js')).toBe(false);
      expect((customConverter as any).shouldProcessFile('lib/utils.js')).toBe(false);
    });
  });
});
