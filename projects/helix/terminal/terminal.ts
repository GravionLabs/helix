
import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, InjectionToken, Input, NgModule, OnDestroy, ViewEncapsulation, input, viewChild, effect, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { find } from '@primeuix/utils';
import { SharedModule } from '@gravionlabs/helix/api';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind } from '@gravionlabs/helix/bind';
import { TerminalPassThrough } from '@gravionlabs/helix/types/terminal';
import { Subscription } from 'rxjs';
import { TerminalStyle } from './style/terminalstyle';
import { TerminalService } from './terminalservice';

const TERMINAL_INSTANCE = new InjectionToken<Terminal>('TERMINAL_INSTANCE');

/**
 * Terminal is a text based user interface.
 * @group Components
 */
@Component({
    selector: 'h-terminal',
    standalone: true,
    imports: [FormsModule, SharedModule, Bind],
    templateUrl: './terminal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [TerminalStyle, { provide: TERMINAL_INSTANCE, useExisting: Terminal }, { provide: PARENT_INSTANCE, useExisting: Terminal }],
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '(click)': 'onHostClick()'
    },
    hostDirectives: [Bind]
})
export class Terminal extends BaseComponent<TerminalPassThrough> implements AfterViewInit, AfterViewChecked, OnDestroy {
    componentName = 'Terminal';
    $pcTerminal: Terminal | undefined = inject(TERMINAL_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    /**
     * Initial text to display on terminal.
     * @group Props
     */
    readonly welcomeMessage = input<string>();
    /**
     * Prompt text for each command.
     * @group Props
     */
    readonly prompt = input<string>();
    /**
     * Style class of the component.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    readonly styleClass = input<string>();

    commands: any[] = [];

    command!: string;

    container!: Element;

    commandProcessed!: boolean;

    subscription: Subscription;

    _componentStyle = inject(TerminalStyle);

    readonly inputRef = viewChild.required<ElementRef<HTMLInputElement>>('in');

    onHostClick() {
        this.focus(this.inputRef()?.nativeElement);
    }

    constructor(public terminalService: TerminalService) {
        super();
        effect(() => {
            const value = this.response();
            if (value) {
                untracked(() => {
                    this.commands[this.commands.length - 1].response = value;
                    this.commandProcessed = true;
                });
            }
        });
        this.subscription = terminalService.responseHandler.subscribe((response) => {
            this.commands[this.commands.length - 1].response = response;
            this.commandProcessed = true;
        });
    }

    onAfterViewInit() {
        this.container = this.el.nativeElement;
    }

    onAfterViewChecked() {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));

        if (this.commandProcessed) {
            this.container.scrollTop = this.container.scrollHeight;
            this.commandProcessed = false;
        }
    }

    readonly response = input<string>();

    handleCommand(event: KeyboardEvent) {
        if (event.keyCode == 13) {
            this.commands.push({ text: this.command });
            this.terminalService.sendCommand(this.command);
            this.command = '';
        }
    }

    focus(element: HTMLElement) {
        element.focus();
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

@NgModule({
    exports: [Terminal, SharedModule],
    imports: [Terminal, SharedModule]
})
export class TerminalModule {}
