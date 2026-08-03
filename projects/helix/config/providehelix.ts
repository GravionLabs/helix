import { EnvironmentProviders, inject, InjectionToken, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { HelixConfig } from './helixconfig';
import type { HelixConfigType } from './primeng.types';

export const HELIX_CONFIG = new InjectionToken<HelixConfigType>('HELIX_CONFIG');

export function provideHelix(...features: HelixConfigType[]): EnvironmentProviders {
    const providers = features?.map((feature) => ({
        provide: HELIX_CONFIG,
        useValue: feature,
        multi: false
    }));

    const initializer = provideAppInitializer(() => {
        const helixConfig = inject(HelixConfig);
        features?.forEach((feature) => helixConfig.setConfig(feature));
        return;
    });

    return makeEnvironmentProviders([...providers, initializer]);
}
