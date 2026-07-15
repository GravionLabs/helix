import { CommonModule } from '@angular/common';
import { AfterViewChecked, ChangeDetectionStrategy, Component, inject, InjectionToken, NgModule, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@gravionlabs/helix/api';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind, BindModule } from '@gravionlabs/helix/bind';
import { IftaLabelPassThrough } from '@gravionlabs/helix/types/iftalabel';
import { IftaLabelStyle } from './style/iftalabelstyle';

const IFTALABEL_INSTANCE = new InjectionToken<IftaLabel>('IFTALABEL_INSTANCE');

/**
 * IftaLabel is used to create infield top aligned labels.
 * @group Components
 */
@Component({
    selector: 'h-iftalabel, h-iftaLabel, h-ifta-label',
    standalone: true,
    imports: [BindModule],
    templateUrl: './iftalabel.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [IftaLabelStyle, { provide: IFTALABEL_INSTANCE, useExisting: IftaLabel }, { provide: PARENT_INSTANCE, useExisting: IftaLabel }],
    hostDirectives: [Bind],
    host: {
        '[class]': "cx('root')"
    }
})
export class IftaLabel extends BaseComponent<IftaLabelPassThrough> implements AfterViewChecked {
    componentName = 'IftaLabel';

    _componentStyle = inject(IftaLabelStyle);

    $pcIftaLabel: IftaLabel | undefined = inject(IFTALABEL_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }
}

@NgModule({
    imports: [IftaLabel, CommonModule, SharedModule, RouterModule],
    exports: [IftaLabel, SharedModule]
})
export class IftaLabelModule {}
