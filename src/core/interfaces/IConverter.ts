/**
 * Common interfaces for converters
 */

import {ConversionPlan, ConversionResult, ValidationResult} from '../types';

export interface IConverter {
  convert(): Promise<ConversionResult>;
}

export interface IAnalyzer {
  analyze(): Promise<ConversionPlan>;
}

export interface ITransformer {
  transform(plan: ConversionPlan): Promise<ConversionResult>;
}

export interface IValidator {
  validate(plan: ConversionPlan): Promise<ValidationResult>;
}
