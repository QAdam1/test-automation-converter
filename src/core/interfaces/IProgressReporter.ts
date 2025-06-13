/**
 * Progress reporting interfaces
 */

import {ProgressEvent} from '@/core/types';
import {ConversionError, ParsingError, ValidationError} from "@/core/errors";

export interface IProgressReporter {
  report(event: ProgressEvent): void;
  start(totalItems: number): void;
  update(current: number, message?: string): void;
  complete(): void;
}

export interface IProgressListener {
  onProgress(event: ProgressEvent): void;
}

// Type guard utilities
export function isConversionError(error: unknown): error is ConversionError {
  return error instanceof ConversionError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export function isParsingError(error: unknown): error is ParsingError {
  return error instanceof ParsingError;
}
