import { Injectable } from '@angular/core';
import { style } from './terminal.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: () => ['h-terminal h-component'],
    welcomeMessage: 'h-terminal-welcome-message',
    commandList: 'h-terminal-command-list',
    command: 'h-terminal-command',
    commandValue: 'h-terminal-command-value',
    commandResponse: 'h-terminal-command-response',
    prompt: 'h-terminal-prompt',
    promptLabel: 'h-terminal-prompt-label',
    promptValue: 'h-terminal-prompt-value'
};

@Injectable()
export class TerminalStyle extends BaseStyle {
    name = 'terminal';

    style = style;

    classes = classes;
}

/**
 *
 * Terminal is a text based user interface.
 *
 * [Live Demo](https://www.primeng.org/terminal)
 *
 * @module terminalstyle
 *
 */
export enum TerminalClasses {
    /**
     * Class name of the root element
     */
    root = 'h-terminal',
    /**
     * Class name of the welcome message element
     */
    welcomeMessage = 'h-terminal-welcome-message',
    /**
     * Class name of the command list element
     */
    commandList = 'h-terminal-command-list',
    /**
     * Class name of the command element
     */
    command = 'h-terminal-command',
    /**
     * Class name of the command value element
     */
    commandValue = 'h-terminal-command-value',
    /**
     * Class name of the command response element
     */
    commandResponse = 'h-terminal-command-response',
    /**
     * Class name of the prompt element
     */
    prompt = 'h-terminal-prompt',
    /**
     * Class name of the prompt label element
     */
    promptLabel = 'h-terminal-prompt-label',
    /**
     * Class name of the prompt value element
     */
    promptValue = 'h-terminal-prompt-value'
}

export interface TerminalStyle extends BaseStyle {}
