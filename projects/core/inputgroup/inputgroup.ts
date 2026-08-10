import { Component, inject, InjectionToken, NgModule, ChangeDetectionStrategy, input } from '@angular/core';
import { SharedModule } from '@helix-ui/core/api';
import { BaseComponent, PARENT_INSTANCE } from '@helix-ui/core/basecomponent';
import { Bind, BindModule } from '@helix-ui/core/bind';
import { InputGroupPassThrough } from '@helix-ui/core/types/inputgroup';
import { InputGroupStyle } from './style/inputgroupstyle';

const INPUTGROUP_INSTANCE = new InjectionToken<InputGroup>('INPUTGROUP_INSTANCE');

/**
 * InputGroup displays text, icon, buttons and other content can be grouped next to an input.
 * @group Components
 */
@Component({
    selector: 'h-inputgroup, h-inputGroup, h-input-group',
    standalone: true,
    imports: [BindModule],
    templateUrl: './inputgroup.html',
    providers: [InputGroupStyle, { provide: INPUTGROUP_INSTANCE, useExisting: InputGroup }, { provide: PARENT_INSTANCE, useExisting: InputGroup }],
    hostDirectives: [Bind],
    changeDetection: ChangeDetectionStrategy.Eager,
    host: {
        '[class]': "cn(cx('root'), styleClass())"
    }
})
export class InputGroup extends BaseComponent<InputGroupPassThrough> {
    componentName = 'InputGroup';

    _componentStyle = inject(InputGroupStyle);

    $pcInputGroup: InputGroup | undefined = inject(INPUTGROUP_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    /**
     * Class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    readonly styleClass = input<string>();
}

@NgModule({
    imports: [InputGroup, SharedModule],
    exports: [InputGroup, SharedModule]
})
export class InputGroupModule {}
