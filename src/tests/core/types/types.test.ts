import {describe, expect, it} from 'vitest';
import type {
    ConflictResolution,
    ConversionOptions,
    ConversionPlan,
    ConversionResult,
    FileInfo,
    ProgressEvent,
    ValidationResult
} from '@/core/types';

describe('Type Definitions', () => {
  it('should allow creating valid ConversionOptions', () => {
    const options: ConversionOptions = {
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

    expect(options).toBeDefined();
    expect(options.source).toBe('/src');
    expect(options.config?.custom).toBe('value');
  });

  it('should allow creating valid FileInfo', () => {
    const fileInfo: FileInfo = {
      path: '/src/index.js',
      content: 'console.log("test");',
      extension: '.js',
      relativePath: 'index.js',
      size: 20,
      lastModified: new Date()
    };

    expect(fileInfo).toBeDefined();
    expect(fileInfo.extension).toBe('.js');
  });

  it('should allow creating valid ConversionResult', () => {
    const result: ConversionResult = {
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

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.stats.totalFiles).toBe(10);
  });

  it('should allow creating valid ValidationResult', () => {
    const validation: ValidationResult = {
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

    expect(validation).toBeDefined();
    expect(validation.valid).toBe(false);
    expect(validation.errors[0].type).toBe('syntax');
  });

  it('should allow creating valid ConversionPlan', () => {
    const plan: ConversionPlan = {
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

    expect(plan).toBeDefined();
    expect(plan.files[0].complexity).toBe('medium');
    expect(plan.potentialIssues[0].severity).toBe('medium');
  });

  it('should allow creating valid ProgressEvent', () => {
    const event: ProgressEvent = {
      phase: 'transformation',
      currentFile: 'src/index.js',
      progress: 45,
      message: 'Processing file',
      operation: 'Converting imports'
    };

    expect(event).toBeDefined();
    expect(event.phase).toBe('transformation');
    expect(event.progress).toBe(45);
  });

  it('should allow creating valid ConflictResolution', () => {
    const conflict: ConflictResolution = {
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

    expect(conflict).toBeDefined();
    expect(conflict.type).toBe('config');
    expect(conflict.options).toHaveLength(2);
    expect(conflict.defaultOption).toBe('update-rule');
  });
});
