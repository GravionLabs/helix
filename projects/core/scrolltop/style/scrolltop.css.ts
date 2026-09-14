export const style = /*css*/ `
    .h-scrolltop.h-button {
        position: fixed !important;
        inset-block-end: 20px;
        inset-inline-end: 20px;
    }

    .h-scrolltop-sticky.h-button {
        position: sticky !important;
        display: flex;
        margin-inline-start: auto;
    }

    .h-scrolltop-enter-from {
        opacity: 0;
    }

    .h-scrolltop-enter-active {
        transition: opacity 300ms;
    }

    .h-scrolltop-leave-to {
        opacity: 0;
    }

    .h-scrolltop-leave-active {
        transition: opacity 300ms;
    }
`;
