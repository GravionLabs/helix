import type { PickListDesignTokens, PickListTokenSections } from '@gravionlabs/helix-core/themes/types';

export const root: PickListTokenSections.Root = {
    gap: '1.125rem'
};

export const controls: PickListTokenSections.Controls = {
    gap: '0.5rem'
};

export default {
    root,
    controls
} satisfies PickListDesignTokens;
