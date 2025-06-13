/**
 * AST processing interfaces
 */

export interface IASTParser {
  parse(code: string, options?: ParserOptions): ASTNode;
}

export interface IASTTransformer {
  transform(ast: ASTNode, visitors: Visitors): ASTNode;
}

export interface IASTGenerator {
  generate(ast: ASTNode, options?: GeneratorOptions): string;
}

export interface ParserOptions {
  sourceType?: 'module' | 'script';
  plugins?: string[];
  sourceFile?: string;
}

export interface GeneratorOptions {
  retainLines?: boolean;
  compact?: boolean;
  comments?: boolean;
}

export interface ASTNode {
  type: string;
  [key: string]: any;
}

export interface Visitors {
  [nodeType: string]: VisitorFunction | VisitorObject;
}

export type VisitorFunction = (path: any) => void;

export interface VisitorObject {
  enter?: VisitorFunction;
  exit?: VisitorFunction;
}
