import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { GvConfigurator, LayoutStore } from '@gravion/sakai-ui';

@Component({
    selector: 'app-floating-configurator',
    standalone: true,
    imports: [CommonModule, ButtonModule, StyleClassModule, GvConfigurator],
    template: `
        <div class="flex gap-4 top-8 right-8" [ngClass]="{'fixed': float()}">
            <p-button type="button" (onClick)="toggleDarkMode()" [rounded]="true" [icon]="isDarkTheme() ? 'pi pi-moon' : 'pi pi-sun'" severity="secondary" />
            <div class="relative">
                <p-button icon="pi pi-palette" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true" type="button" rounded />
                <gv-configurator />
            </div>
        </div>
    `
})
export class AppFloatingConfigurator {
    store = inject(LayoutStore);

    float = input<boolean>(true);

    isDarkTheme = computed(() => this.store.darkTheme());

    toggleDarkMode() {
        this.store.toggleDarkMode();
    }
}
