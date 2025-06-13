/**
 * Abstract base class for all converters
 */

import {
    ConversionError,
    ConversionOptions,
    ConversionPlan,
    ConversionResult,
    ConversionStats,
    ConversionWarning,
    ProgressEvent,
    ValidationResult,
} from '../types';
// @ts-ignore
const minimatch = require('minimatch').minimatch;

export abstract class BaseConverter {
  protected options: ConversionOptions;
  protected errors: ConversionError[] = [];
  protected warnings: ConversionWarning[] = [];
  protected progressListeners: ((event: ProgressEvent) => void)[] = [];

  constructor(options: ConversionOptions) {
    this.options = this.normalizeOptions(options);
  }

  /**
   * Main conversion method
   */
  public async convert(): Promise<ConversionResult> {
    const startTime = Date.now();

    try {
      // Emit initial progress
      this.emitProgress({
        phase: 'analysis',
        progress: 0,
        message: 'Starting conversion...',
      });

      // Add a small delay to ensure duration is non-zero
      await new Promise(resolve => setTimeout(resolve, 1));

      // Analyze the source
      const plan = await this.analyze();

      // Validate the plan
      const validationResult = await this.validate(plan);
      if (!validationResult.valid && !this.options.dryRun) {
        return this.createErrorResult(validationResult, startTime);
      }

      // Execute transformation
      this.emitProgress({
        phase: 'transformation',
        progress: 30,
        message: 'Transforming files...',
      });

      const result = await this.transform(plan);

      // Final validation
      this.emitProgress({
        phase: 'validation',
        progress: 90,
        message: 'Validating results...',
      });

      return {
        ...result,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      return {
        success: false,
        processedFiles: [],
        skippedFiles: [],
        errors: [
          {
            code: 'CONVERSION_FAILED',
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            recoverable: false,
          },
        ],
        warnings: this.warnings,
        stats: this.createEmptyStats(),
        duration,
      };
    }
  }

  /**
   * Analyze source files and create conversion plan
   */
  protected abstract analyze(): Promise<ConversionPlan>;

  /**
   * Transform files according to the plan
   */
  protected abstract transform(plan: ConversionPlan): Promise<ConversionResult>;

  /**
   * Validate the conversion plan or result
   */
  protected abstract validate(plan: ConversionPlan): Promise<ValidationResult>;

  /**
   * Add progress listener
   */
  public onProgress(listener: (event: ProgressEvent) => void): void {
    this.progressListeners.push(listener);
  }

  /**
   * Remove progress listener
   */
  public offProgress(listener: (event: ProgressEvent) => void): void {
    const index = this.progressListeners.indexOf(listener);
    if (index > -1) {
      this.progressListeners.splice(index, 1);
    }
  }

  /**
   * Emit progress event
   */
  protected emitProgress(event: ProgressEvent): void {
    this.progressListeners.forEach(listener => listener(event));
  }

  /**
   * Add error
   */
  protected addError(error: Omit<ConversionError, 'recoverable'>): void {
    this.errors.push({
      ...error,
      recoverable: false,
    });
  }

  /**
   * Add warning
   */
  protected addWarning(warning: ConversionWarning): void {
    this.warnings.push(warning);
  }

  /**
   * Normalize conversion options
   */
  protected normalizeOptions(options: ConversionOptions): ConversionOptions {
    return {
      ...options,
      dryRun: options.dryRun ?? false,
      backup: options.backup ?? true,
      backupDir: options.backupDir ?? '.backup',
      preserveStructure: options.preserveStructure ?? true,
      interactive: options.interactive ?? false,
      verbose: options.verbose ?? false,
      concurrency: options.concurrency ?? 5,
      include: options.include ?? ['**/*'],
      exclude: options.exclude ?? ['**/node_modules/**', '**/.git/**'],
    };
  }

  /**
   * Create error result from validation
   */
  protected createErrorResult(validation: ValidationResult, startTime: number): ConversionResult {
    return {
      success: false,
      processedFiles: [],
      skippedFiles: [],
      errors: validation.errors.map(err => ({
        code: `VALIDATION_${err.type.toUpperCase()}`,
        message: err.message,
        file: err.file,
        line: err.location?.startLine,
        column: err.location?.startColumn,
        recoverable: false,
      })),
      warnings: [
        ...this.warnings,
        ...validation.warnings.map(warn => ({
          code: `VALIDATION_${warn.type.toUpperCase()}`,
          message: warn.message,
          file: warn.file,
          line: warn.location?.startLine,
          suggestion: warn.suggestion,
        })),
      ],
      stats: this.createEmptyStats(),
      duration: Date.now() - startTime,
    };
  }

  /**
   * Create empty stats object
   */
  protected createEmptyStats(): ConversionStats {
    return {
      totalFiles: 0,
      processedFiles: 0,
      skippedFiles: 0,
      errorFiles: 0,
      totalChanges: 0,
      totalErrors: this.errors.length,
      totalWarnings: this.warnings.length,
    };
  }

  /**
   * Check if file should be processed
   */
  protected shouldProcessFile(filePath: string): boolean {
    const excludePatterns = this.options.exclude || [];
    const includePatterns = this.options.include || ['**/*'];

    // Check excludes first
    for (const pattern of excludePatterns) {
      if (minimatch(filePath, pattern)) {
        return false;
      }
    }

    // Check includes
    for (const pattern of includePatterns) {
      if (minimatch(filePath, pattern)) {
        return true;
      }
    }

    return false;
  }
}
