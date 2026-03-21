import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutStore } from '../../store';
import { GvConfigurator } from '../configurator/configurator';

@Component({
    selector: 'gv-floating-configurator',
    standalone: true,
    imports: [CommonModule, ButtonModule, StyleClassModule, GvConfigurator],
    templateUrl: './floating-configurator.html',
    styleUrl: './floating-configurator.scss'
})
export class GvFloatingConfigurator {
    store = inject(LayoutStore);

    float = input<boolean>(true);

    isDarkTheme = computed(() => this.store.darkTheme());

    toggleDarkMode() {
        this.store.toggleDarkMode();
    }
}
