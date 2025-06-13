/**
 * File processing interfaces
 */

import {FileInfo, ProcessedFile} from '../types';

export interface IFileProcessor {
  processFile(file: FileInfo): Promise<ProcessedFile>;
  processFiles(files: FileInfo[]): Promise<ProcessedFile[]>;
}

export interface IFileReader {
  readFile(path: string): Promise<FileInfo>;
  readFiles(paths: string[]): Promise<FileInfo[]>;
  findFiles(pattern: string): Promise<string[]>;
}

export interface IFileWriter {
  writeFile(file: ProcessedFile): Promise<void>;
  writeFiles(files: ProcessedFile[]): Promise<void>;
}

export interface IBackupManager {
  createBackup(file: FileInfo): Promise<string>;
  restoreBackup(backupPath: string): Promise<void>;
  cleanupBackups(): Promise<void>;
}
