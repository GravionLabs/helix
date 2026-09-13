import { deepMerge } from '@gravionlabs/helix-core/uix/utils';
import Theme from '../config/index';

export default function usePreset<T extends Record<string, unknown>>(...presets: T[]): T {
    const newPreset = deepMerge(...presets);

    Theme.setPreset(newPreset);

    return newPreset as T;
}
