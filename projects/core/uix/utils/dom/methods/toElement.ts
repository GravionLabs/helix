import isElement from './isElement';

type ReactElement = { current: Element | null | undefined };
type VueElement = { el: Element | null | undefined };
type AngularElement = { el: { nativeElement: Element | undefined } };
type RefWrapper = { elementRef: unknown };

/**
 * Ported from @primeuix/utils 0.7.2 (main was 0.6.4 at vendor time): adds `value` (signal-style
 * refs) and recursive `elementRef` unwrapping on top of the 0.6.4 current/el handling.
 */
export default function toElement(element: unknown): Element | null | undefined {
    if (isElement(element)) {
        return element;
    }

    if (!element || typeof element !== 'object') {
        return undefined;
    }

    let target: unknown = element;

    if (Object.hasOwn(element, 'current')) {
        // For React
        target = toElement((element as ReactElement).current) ?? (element as ReactElement).current;
    } else if (Object.hasOwn(element, 'value')) {
        // For Angular signals / Vue refs
        target = (element as { value: unknown }).value;
    } else if (Object.hasOwn(element, 'nativeElement')) {
        // For Angular ElementRef
        target = (element as { nativeElement: unknown }).nativeElement;
    } else if (Object.hasOwn(element, 'el')) {
        const el = (element as AngularElement).el;

        if (el && typeof el === 'object' && Object.hasOwn(el, 'nativeElement')) {
            // For Angular
            target = (el as { nativeElement: unknown }).nativeElement;
        } else {
            // For Vue
            target = (element as VueElement).el;
        }
    } else if (Object.hasOwn(element, 'elementRef')) {
        return toElement((element as RefWrapper).elementRef);
    }

    return isElement(target) ? target : undefined;
}
