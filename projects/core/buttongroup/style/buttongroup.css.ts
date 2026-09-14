export const style = /*css*/ `
    .h-buttongroup {
        display: inline-flex;
    }

    .h-buttongroup .h-button {
        margin: 0;
    }

    .h-buttongroup .h-button:not(:last-child),
    .h-buttongroup .h-button:not(:last-child):hover {
        border-inline-end: 0 none;
    }

    .h-buttongroup .h-button:not(:first-of-type):not(:last-of-type) {
        border-radius: 0;
    }

    .h-buttongroup .h-button:first-of-type:not(:only-of-type) {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    .h-buttongroup .h-button:last-of-type:not(:only-of-type) {
        border-start-start-radius: 0;
        border-end-start-radius: 0;
    }

    .h-buttongroup .h-button:focus {
        position: relative;
        z-index: 1;
    }
`;
