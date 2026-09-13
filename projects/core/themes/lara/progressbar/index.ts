import type { ProgressBarDesignTokens, ProgressBarTokenSections } from '@gravionlabs/helix-core/themes/types';

export const root: ProgressBarTokenSections.Root = {
    background: '{content.border.color}',
    borderRadius: '{content.border.radius}',
    height: '1.5rem'
};

export const value: ProgressBarTokenSections.Value = {
    background: '{primary.color}'
};

export const label: ProgressBarTokenSections.Label = {
    color: '{primary.contrast.color}',
    fontSize: '0.875rem',
    fontWeight: '600'
};

export default {
    root,
    value,
    label
} satisfies ProgressBarDesignTokens;
