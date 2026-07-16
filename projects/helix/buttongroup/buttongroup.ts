
import { ChangeDetectionStrategy, Component, inject, NgModule, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '@gravionlabs/helix/basecomponent';
import { ButtonGroupStyle } from './style/buttongroupstyle';

@Component({
    selector: 'h-buttonGroup, h-buttongroup, h-button-group',
    standalone: true,
    imports: [],
    templateUrl: './buttongroup.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ButtonGroupStyle]
})
export class ButtonGroup extends BaseComponent {
    componentName = 'ButtonGroup';

    _componentStyle = inject(ButtonGroupStyle);
}

@NgModule({
    imports: [ButtonGroup],
    exports: [ButtonGroup]
})
export class ButtonGroupModule {}
