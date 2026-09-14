import type { OverlayBadgeDesignTokens, OverlayBadgeTokenSections } from '@gravionlabs/helix-core/themes/types';

export const root: OverlayBadgeTokenSections.Root = {
    outline: {
        width: '2px',
        color: '{content.background}'
    }
};

export default {
    root
} satisfies OverlayBadgeDesignTokens;
