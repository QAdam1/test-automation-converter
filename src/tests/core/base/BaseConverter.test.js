"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const BaseConverter_1 = require("src/core/base/BaseConverter");
// Mock implementation for testing
class TestConverter extends BaseConverter_1.BaseConverter {
    async analyze() {
        return {
            files: [],
            estimatedDuration: 1000,
            requiredDiskSpace: 1024,
            potentialIssues: [],
            configChanges: [],
        };
    }
    async transform(_plan) {
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
    async validate(_plan) {
        return {
            valid: true,
            errors: [],
            warnings: [],
        };
    }
}
(0, vitest_1.describe)('BaseConverter', () => {
    let converter;
    let options;
    (0, vitest_1.beforeEach)(() => {
        options = {
            source: '/test/source',
            target: '/test/target',
        };
        converter = new TestConverter(options);
    });
    (0, vitest_1.describe)('constructor', () => {
        (0, vitest_1.it)('should normalize options with defaults', () => {
            const normalizedOptions = converter.options;
            (0, vitest_1.expect)(normalizedOptions.dryRun).toBe(false);
            (0, vitest_1.expect)(normalizedOptions.backup).toBe(true);
            (0, vitest_1.expect)(normalizedOptions.backupDir).toBe('.backup');
            (0, vitest_1.expect)(normalizedOptions.preserveStructure).toBe(true);
            (0, vitest_1.expect)(normalizedOptions.interactive).toBe(false);
            (0, vitest_1.expect)(normalizedOptions.verbose).toBe(false);
            (0, vitest_1.expect)(normalizedOptions.concurrency).toBe(5);
            (0, vitest_1.expect)(normalizedOptions.include).toEqual(['**/*']);
            (0, vitest_1.expect)(normalizedOptions.exclude).toEqual(['**/node_modules/**', '**/.git/**']);
        });
        (0, vitest_1.it)('should preserve provided options', () => {
            const customOptions = {
                source: '/test/source',
                dryRun: true,
                backup: false,
                concurrency: 10,
            };
            const customConverter = new TestConverter(customOptions);
            const normalizedOptions = customConverter.options;
            (0, vitest_1.expect)(normalizedOptions.dryRun).toBe(true);
            (0, vitest_1.expect)(normalizedOptions.backup).toBe(false);
            (0, vitest_1.expect)(normalizedOptions.concurrency).toBe(10);
        });
    });
    (0, vitest_1.describe)('convert', () => {
        (0, vitest_1.it)('should execute conversion pipeline successfully', async () => {
            const result = await converter.convert();
            (0, vitest_1.expect)(result.success).toBe(true);
            (0, vitest_1.expect)(result.processedFiles).toEqual([]);
            (0, vitest_1.expect)(result.errors).toEqual([]);
            (0, vitest_1.expect)(result.duration).toBeGreaterThan(0);
        });
        (0, vitest_1.it)('should emit progress events', async () => {
            const progressEvents = [];
            converter.onProgress(event => progressEvents.push(event));
            await converter.convert();
            (0, vitest_1.expect)(progressEvents.length).toBeGreaterThan(0);
            (0, vitest_1.expect)(progressEvents[0].phase).toBe('analysis');
            (0, vitest_1.expect)(progressEvents[0].progress).toBe(0);
            (0, vitest_1.expect)(progressEvents.find(e => e.phase === 'transformation')).toBeDefined();
            (0, vitest_1.expect)(progressEvents.find(e => e.phase === 'validation')).toBeDefined();
        });
        (0, vitest_1.it)('should handle validation failure', async () => {
            const failingConverter = new (class extends TestConverter {
                async validate() {
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
            (0, vitest_1.expect)(result.success).toBe(false);
            (0, vitest_1.expect)(result.errors.length).toBe(1);
            (0, vitest_1.expect)(result.errors[0].code).toBe('VALIDATION_SYNTAX');
            (0, vitest_1.expect)(result.errors[0].message).toBe('Invalid syntax');
        });
        (0, vitest_1.it)('should handle conversion errors', async () => {
            const errorConverter = new (class extends TestConverter {
                async transform() {
                    throw new Error('Transformation failed');
                }
            })(options);
            const result = await errorConverter.convert();
            (0, vitest_1.expect)(result.success).toBe(false);
            (0, vitest_1.expect)(result.errors.length).toBe(1);
            (0, vitest_1.expect)(result.errors[0].code).toBe('CONVERSION_FAILED');
            (0, vitest_1.expect)(result.errors[0].message).toBe('Transformation failed');
        });
    });
    (0, vitest_1.describe)('progress listeners', () => {
        (0, vitest_1.it)('should add and remove progress listeners', () => {
            const listener1 = vitest_1.vi.fn();
            const listener2 = vitest_1.vi.fn();
            converter.onProgress(listener1);
            converter.onProgress(listener2);
            converter.emitProgress({
                phase: 'analysis',
                progress: 50,
                message: 'Test',
            });
            (0, vitest_1.expect)(listener1).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(listener2).toHaveBeenCalledTimes(1);
            converter.offProgress(listener1);
            converter.emitProgress({
                phase: 'analysis',
                progress: 100,
                message: 'Test 2',
            });
            (0, vitest_1.expect)(listener1).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(listener2).toHaveBeenCalledTimes(2);
        });
    });
    (0, vitest_1.describe)('error and warning management', () => {
        (0, vitest_1.it)('should add errors', () => {
            converter.addError({
                code: 'TEST_ERROR',
                message: 'Test error',
            });
            (0, vitest_1.expect)(converter.errors.length).toBe(1);
            (0, vitest_1.expect)(converter.errors[0].code).toBe('TEST_ERROR');
            (0, vitest_1.expect)(converter.errors[0].recoverable).toBe(false);
        });
        (0, vitest_1.it)('should add warnings', () => {
            converter.addWarning({
                code: 'TEST_WARNING',
                message: 'Test warning',
            });
            (0, vitest_1.expect)(converter.warnings.length).toBe(1);
            (0, vitest_1.expect)(converter.warnings[0].code).toBe('TEST_WARNING');
        });
    });
    (0, vitest_1.describe)('shouldProcessFile', () => {
        (0, vitest_1.it)('should include files by default', () => {
            (0, vitest_1.expect)(converter.shouldProcessFile('src/index.js')).toBe(true);
            (0, vitest_1.expect)(converter.shouldProcessFile('test/spec.js')).toBe(true);
        });
        (0, vitest_1.it)('should exclude node_modules by default', () => {
            (0, vitest_1.expect)(converter.shouldProcessFile('node_modules/package/index.js')).toBe(false);
            (0, vitest_1.expect)(converter.shouldProcessFile('src/node_modules/local.js')).toBe(false);
        });
        (0, vitest_1.it)('should exclude .git by default', () => {
            (0, vitest_1.expect)(converter.shouldProcessFile('.git/config')).toBe(false);
            (0, vitest_1.expect)(converter.shouldProcessFile('src/.git/hooks')).toBe(false);
        });
        (0, vitest_1.it)('should respect custom include/exclude patterns', () => {
            const customConverter = new TestConverter({
                source: '/test',
                include: ['src/**/*.js'],
                exclude: ['**/*.test.js'],
            });
            (0, vitest_1.expect)(customConverter.shouldProcessFile('src/index.js')).toBe(true);
            (0, vitest_1.expect)(customConverter.shouldProcessFile('src/index.test.js')).toBe(false);
            (0, vitest_1.expect)(customConverter.shouldProcessFile('lib/utils.js')).toBe(false);
        });
    });
});
//# sourceMappingURL=BaseConverter.test.js.map
