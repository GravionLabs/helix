export const style = /*css*/ `
    .h-terminal {
        display: block;
        height: dt('terminal.height');
        overflow: auto;
        background: dt('terminal.background');
        color: dt('terminal.color');
        border: 1px solid dt('terminal.border.color');
        padding: dt('terminal.padding');
        border-radius: dt('terminal.border.radius');
    }

    .h-terminal-prompt {
        display: flex;
        align-items: center;
    }

    .h-terminal-prompt-value {
        flex: 1 1 auto;
        border: 0 none;
        background: transparent;
        color: inherit;
        padding: 0;
        outline: 0 none;
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
    }

    .h-terminal-prompt-label {
        margin-inline-end: dt('terminal.prompt.gap');
    }

    .h-terminal-input::-ms-clear {
        display: none;
    }

    .h-terminal-command-response {
        margin: dt('terminal.command.response.margin');
    }
`;
