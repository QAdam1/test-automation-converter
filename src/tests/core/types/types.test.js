"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
(0, vitest_1.describe)('Type Definitions', () => {
    (0, vitest_1.it)('should allow creating valid ConversionOptions', () => {
        const options = {
            source: '/src',
            target: '/dist',
            dryRun: true,
            backup: true,
            backupDir: '.backup',
            include: ['**/*.js'],
            exclude: ['**/node_modules/**'],
            preserveStructure: true,
            interactive: false,
            verbose: true,
            config: { custom: 'value' },
            concurrency: 10
        };
        (0, vitest_1.expect)(options).toBeDefined();
        (0, vitest_1.expect)(options.source).toBe('/src');
        (0, vitest_1.expect)(options.config?.custom).toBe('value');
    });
    (0, vitest_1.it)('should allow creating valid FileInfo', () => {
        const fileInfo = {
            path: '/src/index.js',
            content: 'console.log("test");',
            extension: '.js',
            relativePath: 'index.js',
            size: 20,
            lastModified: new Date()
        };
        (0, vitest_1.expect)(fileInfo).toBeDefined();
        (0, vitest_1.expect)(fileInfo.extension).toBe('.js');
    });
    (0, vitest_1.it)('should allow creating valid ConversionResult', () => {
        const result = {
            success: true,
            processedFiles: [],
            skippedFiles: [],
            errors: [],
            warnings: [],
            stats: {
                totalFiles: 10,
                processedFiles: 8,
                skippedFiles: 2,
                errorFiles: 0,
                totalChanges: 25,
                totalErrors: 0,
                totalWarnings: 3
            },
            duration: 1500
        };
        (0, vitest_1.expect)(result).toBeDefined();
        (0, vitest_1.expect)(result.success).toBe(true);
        (0, vitest_1.expect)(result.stats.totalFiles).toBe(10);
    });
    (0, vitest_1.it)('should allow creating valid ValidationResult', () => {
        const validation = {
            valid: false,
            errors: [{
                    type: 'syntax',
                    message: 'Invalid syntax',
                    file: 'test.js',
                    location: {
                        startLine: 10,
                        startColumn: 5,
                        endLine: 10,
                        endColumn: 15
                    }
                }],
            warnings: [{
                    type: 'deprecation',
                    message: 'Deprecated API usage',
                    suggestion: 'Use new API instead'
                }]
        };
        (0, vitest_1.expect)(validation).toBeDefined();
        (0, vitest_1.expect)(validation.valid).toBe(false);
        (0, vitest_1.expect)(validation.errors[0].type).toBe('syntax');
    });
    (0, vitest_1.it)('should allow creating valid ConversionPlan', () => {
        const plan = {
            files: [{
                    source: {
                        path: 'src/index.js',
                        content: '',
                        extension: '.js',
                        relativePath: 'index.js',
                        size: 100,
                        lastModified: new Date()
                    },
                    targetPath: 'dist/index.mjs',
                    transformations: [{
                            type: 'require-to-import',
                            description: 'Convert require to import',
                            priority: 1
                        }],
                    complexity: 'medium'
                }],
            estimatedDuration: 5000,
            requiredDiskSpace: 1024 * 1024,
            potentialIssues: [{
                    severity: 'medium',
                    description: 'Dynamic requires detected',
                    affectedFiles: ['src/utils.js'],
                    resolution: 'Convert to dynamic imports'
                }],
            configChanges: [{
                    file: 'package.json',
                    type: 'modify',
                    changes: { type: 'module' },
                    requiresConfirmation: true
                }]
        };
        (0, vitest_1.expect)(plan).toBeDefined();
        (0, vitest_1.expect)(plan.files[0].complexity).toBe('medium');
        (0, vitest_1.expect)(plan.potentialIssues[0].severity).toBe('medium');
    });
    (0, vitest_1.it)('should allow creating valid ProgressEvent', () => {
        const event = {
            phase: 'transformation',
            currentFile: 'src/index.js',
            progress: 45,
            message: 'Processing file',
            operation: 'Converting imports'
        };
        (0, vitest_1.expect)(event).toBeDefined();
        (0, vitest_1.expect)(event.phase).toBe('transformation');
        (0, vitest_1.expect)(event.progress).toBe(45);
    });
    (0, vitest_1.it)('should allow creating valid ConflictResolution', () => {
        const conflict = {
            type: 'config',
            description: 'ESLint rule conflict',
            options: [{
                    id: 'keep-existing',
                    label: 'Keep existing rule',
                    description: 'Maintain current ESLint configuration',
                    impact: 'May cause linting errors after conversion'
                }, {
                    id: 'update-rule',
                    label: 'Update rule',
                    description: 'Update to ESM-compatible rule',
                    impact: 'Ensures compatibility with ES modules'
                }],
            defaultOption: 'update-rule'
        };
        (0, vitest_1.expect)(conflict).toBeDefined();
        (0, vitest_1.expect)(conflict.type).toBe('config');
        (0, vitest_1.expect)(conflict.options).toHaveLength(2);
        (0, vitest_1.expect)(conflict.defaultOption).toBe('update-rule');
    });
});
//# sourceMappingURL=types.test.js.map