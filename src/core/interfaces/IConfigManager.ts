/**
 * Configuration management interfaces
 */

export interface IConfigReader {
  readConfig(path: string): Promise<Record<string, unknown>>;
  findConfigs(dir: string): Promise<ConfigFile[]>;
}

export interface IConfigResolver {
  resolveConflicts(configs: ConfigFile[]): Promise<ResolvedConfig>;
  mergeConfigs(configs: Record<string, unknown>[]): Record<string, unknown>;
}

export interface IConfigUpdater {
  updateConfig(path: string, changes: Record<string, unknown>): Promise<void>;
  createConfig(path: string, content: Record<string, unknown>): Promise<void>;
}

export interface ConfigFile {
  path: string;
  type: 'babel' | 'eslint' | 'typescript' | 'jsconfig' | 'package';
  content: Record<string, unknown>;
}

export interface ResolvedConfig {
  config: Record<string, unknown>;
  conflicts: ConfigConflict[];
}

export interface ConfigConflict {
  key: string;
  values: Array<{ source: string; value: unknown }>;
  resolution?: unknown;
}
