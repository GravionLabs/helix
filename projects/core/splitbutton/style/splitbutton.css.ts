export const style = /*css*/ `
    .h-splitbutton {
        display: inline-flex;
        position: relative;
        border-radius: dt('splitbutton.border.radius');
    }

    .h-splitbutton-button.h-button {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
        border-inline-end: 0 none;
    }

    .h-splitbutton-button.h-button:focus-visible,
    .h-splitbutton-dropdown.h-button:focus-visible {
        z-index: 1;
    }

    .h-splitbutton-button.h-button:not(:disabled):hover,
    .h-splitbutton-button.h-button:not(:disabled):active {
        border-inline-end: 0 none;
    }

    .h-splitbutton-dropdown.h-button {
        border-start-start-radius: 0;
        border-end-start-radius: 0;
    }

    .h-splitbutton .h-menu {
        min-width: 100%;
    }

    .h-splitbutton-fluid {
        display: flex;
    }

    .h-splitbutton-rounded .h-splitbutton-dropdown.h-button {
        border-start-end-radius: dt('splitbutton.rounded.border.radius');
        border-end-end-radius: dt('splitbutton.rounded.border.radius');
    }

    .h-splitbutton-rounded .h-splitbutton-button.h-button {
        border-start-start-radius: dt('splitbutton.rounded.border.radius');
        border-end-start-radius: dt('splitbutton.rounded.border.radius');
    }

    .h-splitbutton-raised {
        box-shadow: dt('splitbutton.raised.shadow');
    }
`;
