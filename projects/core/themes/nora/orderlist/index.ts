import type { OrderListDesignTokens, OrderListTokenSections } from '@gravionlabs/helix-core/themes/types';

export const root: OrderListTokenSections.Root = {
    gap: '1.125rem'
};

export const controls: OrderListTokenSections.Controls = {
    gap: '0.5rem'
};

export default {
    root,
    controls
} satisfies OrderListDesignTokens;
