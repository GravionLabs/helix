import isElement from './isElement';

/**
 * Ported from @primeuix/utils 0.7.2 (main was 0.6.4 at vendor time): `attribute === 'style'` with
 * an object value sets each CSS property via `style.setProperty` instead of stringifying it into
 * a plain attribute value.
 */
export default function setAttribute(element: HTMLElement, attribute: string = '', value: any): void {
    if (isElement(element) && value !== null && value !== undefined) {
        if (attribute === 'style' && typeof value === 'object') {
            Object.entries(value as Record<string, unknown>).forEach(([property, propertyValue]) => {
                if (propertyValue == null) {
                    return;
                }

                const cssProperty = property.startsWith('--') ? property : property.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

                element.style.setProperty(cssProperty, String(propertyValue));
            });

            return;
        }

        if (attribute === 'style' && typeof value === 'string') {
            element.style.cssText = value;

            return;
        }

        element.setAttribute(attribute, value);
    }
}
