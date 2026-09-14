import { deepMerge } from '@gravionlabs/helix-core/uix/utils';

export default function definePreset<T extends Record<string, unknown>>(...presets: T[]): T {
    return deepMerge(...presets) as T;
}
