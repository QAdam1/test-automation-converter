/**
 * Core type definitions for the Test Automation Converter
 */

export interface ConversionOptions {
  /** Source directory or file path */
  source: string;
  /** Target directory for converted files */
  target?: string;
  /** Run in dry-run mode (preview changes without writing) */
  dryRun?: boolean;
  /** Create backups before modifying files */
  backup?: boolean;
  /** Backup directory path */
  backupDir?: string;
  /** File patterns to include */
  include?: string[];
  /** File patterns to exclude */
  exclude?: string[];
  /** Preserve file structure */
  preserveStructure?: boolean;
  /** Interactive mode for conflict resolution */
  interactive?: boolean;
  /** Verbose logging */
  verbose?: boolean;
  /** Custom configuration overrides */
  config?: Record<string, unknown>;
  /** Maximum number of files to process in parallel */
  concurrency?: number;
}

export interface FileInfo {
  /** Original file path */
  path: string;
  /** File content */
  content: string;
  /** File extension */
  extension: string;
  /** Relative path from source */
  relativePath: string;
  /** File size in bytes */
  size: number;
  /** Last modified timestamp */
  lastModified: Date;
}

export interface ConversionResult {
  /** Whether conversion was successful */
  success: boolean;
  /** Files that were processed */
  processedFiles: ProcessedFile[];
  /** Files that were skipped */
  skippedFiles: SkippedFile[];
  /** Errors encountered during conversion */
  errors: ConversionError[];
  /** Warnings generated during conversion */
  warnings: ConversionWarning[];
  /** Overall statistics */
  stats: ConversionStats;
  /** Time taken for conversion */
  duration: number;
}

export interface ProcessedFile {
  /** Source file info */
  source: FileInfo;
  /** Target file info */
  target: FileInfo;
  /** Changes made to the file */
  changes: FileChange[];
  /** Whether file was modified */
  modified: boolean;
  /** Backup location if backed up */
  backupPath?: string;
}

export interface SkippedFile {
  /** File that was skipped */
  file: FileInfo;
  /** Reason for skipping */
  reason: string;
}

export interface FileChange {
  /** Type of change */
  type: 'add' | 'remove' | 'modify' | 'rename';
  /** Description of the change */
  description: string;
  /** Line number where change occurred */
  line?: number;
  /** Column number where change occurred */
  column?: number;
  /** Original code snippet */
  before?: string;
  /** Modified code snippet */
  after?: string;
}

export interface ConversionError {
  /** Error code */
  code: string;
  /** Error message */
  message: string;
  /** File where error occurred */
  file?: string;
  /** Line number */
  line?: number;
  /** Column number */
  column?: number;
  /** Stack trace */
  stack?: string;
  /** Whether error is recoverable */
  recoverable: boolean;
}

export interface ConversionWarning {
  /** Warning code */
  code: string;
  /** Warning message */
  message: string;
  /** File where warning occurred */
  file?: string;
  /** Line number */
  line?: number;
  /** Suggestion for fixing */
  suggestion?: string;
}

export interface ConversionStats {
  /** Total files found */
  totalFiles: number;
  /** Files successfully processed */
  processedFiles: number;
  /** Files skipped */
  skippedFiles: number;
  /** Files with errors */
  errorFiles: number;
  /** Total changes made */
  totalChanges: number;
  /** Total errors */
  totalErrors: number;
  /** Total warnings */
  totalWarnings: number;
}

export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** Validation errors */
  errors: ValidationError[];
  /** Validation warnings */
  warnings: ValidationWarning[];
}

export interface ValidationError {
  /** Type of validation error */
  type: 'syntax' | 'semantic' | 'config' | 'compatibility';
  /** Error message */
  message: string;
  /** File path */
  file?: string;
  /** Location in file */
  location?: SourceLocation;
}

export interface ValidationWarning {
  /** Type of validation warning */
  type: 'deprecation' | 'bestPractice' | 'performance' | 'compatibility';
  /** Warning message */
  message: string;
  /** File path */
  file?: string;
  /** Location in file */
  location?: SourceLocation;
  /** Suggestion for improvement */
  suggestion?: string;
}

export interface SourceLocation {
  /** Start line */
  startLine: number;
  /** Start column */
  startColumn: number;
  /** End line */
  endLine?: number;
  /** End column */
  endColumn?: number;
}

export interface ConversionPlan {
  /** Files to be converted */
  files: FileConversionPlan[];
  /** Estimated duration */
  estimatedDuration: number;
  /** Required disk space */
  requiredDiskSpace: number;
  /** Potential issues identified */
  potentialIssues: PotentialIssue[];
  /** Configuration changes needed */
  configChanges: ConfigChange[];
}

export interface FileConversionPlan {
  /** Source file */
  source: FileInfo;
  /** Target path */
  targetPath: string;
  /** Transformations to apply */
  transformations: TransformationPlan[];
  /** Estimated complexity */
  complexity: 'low' | 'medium' | 'high';
}

export interface TransformationPlan {
  /** Type of transformation */
  type: string;
  /** Description */
  description: string;
  /** Priority */
  priority: number;
  /** Dependencies on other transformations */
  dependencies?: string[];
}

export interface PotentialIssue {
  /** Severity of the issue */
  severity: 'low' | 'medium' | 'high';
  /** Issue description */
  description: string;
  /** Files affected */
  affectedFiles: string[];
  /** Suggested resolution */
  resolution?: string;
}

export interface ConfigChange {
  /** Configuration file path */
  file: string;
  /** Type of change */
  type: 'create' | 'modify' | 'delete';
  /** Changes to make */
  changes: Record<string, unknown>;
  /** Whether change requires user confirmation */
  requiresConfirmation: boolean;
}

export interface ProgressEvent {
  /** Current phase */
  phase: 'analysis' | 'planning' | 'transformation' | 'validation' | 'writing';
  /** Current file being processed */
  currentFile?: string;
  /** Progress percentage */
  progress: number;
  /** Message */
  message: string;
  /** Current operation */
  operation?: string;
}

export interface BackupInfo {
  /** Original file path */
  originalPath: string;
  /** Backup file path */
  backupPath: string;
  /** Timestamp of backup */
  timestamp: Date;
  /** Size of backup */
  size: number;
}

export interface ConflictResolution {
  /** Type of conflict */
  type: 'config' | 'naming' | 'dependency' | 'pattern';
  /** Description of conflict */
  description: string;
  /** Available options */
  options: ResolutionOption[];
  /** Default option */
  defaultOption?: string;
}

export interface ResolutionOption {
  /** Option ID */
  id: string;
  /** Option label */
  label: string;
  /** Description of what this option does */
  description: string;
  /** Impact of choosing this option */
  impact?: string;
}

// Utility types
export type ConversionModule = 'cjs-to-esm' | 'js-to-ts' | 'wdio-to-playwright' | 'cucumber-to-playwright';
export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'verbose';
