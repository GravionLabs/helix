/**
 * Ported from @primeuix/utils 0.7.2 (new in 0.7.x; not present in main's 0.6.4 at vendor time).
 */
export default function isCssSupported(property: string, value?: string): boolean {
    if (typeof CSS === 'undefined' || !CSS.supports) {
        return false;
    }

    if (value !== undefined) {
        const cssProperty = property.toString().replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

        return CSS.supports(cssProperty, value);
    }

    return CSS.supports(property.toString());
}
