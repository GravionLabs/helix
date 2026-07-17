
import { ChangeDetectionStrategy, Component, inject, InjectionToken, NgModule, ViewEncapsulation } from '@angular/core';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind } from '@gravionlabs/helix/bind';
import { FluidPassThrough } from '@gravionlabs/helix/types/fluid';
import { FluidStyle } from './style/fluidstyle';

const FLUID_INSTANCE = new InjectionToken<Fluid>('FLUID_INSTANCE');

/**
 * Fluid is a layout component to make descendant components span full width of their container.
 * @group Components
 */
@Component({
    selector: 'h-fluid',
    templateUrl: './fluid.html',
    standalone: true,
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [FluidStyle, { provide: FLUID_INSTANCE, useExisting: Fluid }, { provide: PARENT_INSTANCE, useExisting: Fluid }],
    host: {
        '[class]': "cx('root')"
    },
    hostDirectives: [Bind]
})
export class Fluid extends BaseComponent<FluidPassThrough> {
    componentName = 'Fluid';

    $pcFluid: Fluid | undefined = inject(FLUID_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    _componentStyle = inject(FluidStyle);
}

@NgModule({
    imports: [Fluid],
    exports: [Fluid]
})
export class FluidModule {}
