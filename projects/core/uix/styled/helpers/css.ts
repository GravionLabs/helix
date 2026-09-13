import { resolve } from '@gravionlabs/helix-core/uix/utils';
import { evaluateDtExpressions, type StyleType } from '../public_api';
import { dt } from './dt';

export function css(strings: TemplateStringsArray | StyleType, ...exprs: unknown[]): string | undefined {
    if (strings instanceof Array) {
        const raw = strings.reduce((acc, str, i) => acc + str + (resolve(exprs[i], { dt }) ?? ''), '');

        return evaluateDtExpressions(raw, dt);
    }

    return resolve(strings as unknown, { dt }) as string | undefined;
}
