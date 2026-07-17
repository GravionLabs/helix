import { AfterViewInit, booleanAttribute, Directive, ElementRef, HostListener, Input, NgModule, NgZone, OnDestroy, Renderer2, input, output } from '@angular/core';
import { addClass, removeClass } from '@primeuix/utils';
import { DomHandler } from '@gravionlabs/helix/dom';
import { VoidListener } from '@gravionlabs/helix/ts-helpers';

/**
 * hDraggable directive apply draggable behavior to any element.
 * @group Components
 */
@Directive({
    selector: '[hDraggable]',
    standalone: true
})
export class Draggable implements AfterViewInit, OnDestroy {
    readonly scope = input<string>(undefined, { alias: "hDraggable" });
    /**
     * Defines the cursor style.
     * @group Props
     */
    readonly dragEffect = input<'none' | 'copy' | 'copyLink' | 'copyMove' | 'link' | 'linkMove' | 'move' | 'all' | 'uninitialized'>();
    /**
     * Selector to define the drag handle, by default anywhere on the target element is a drag handle to start dragging.
     * @group Props
     */
    readonly dragHandle = input<string>();
    /**
     * Callback to invoke when drag begins.
     * @param {DragEvent} event - Drag event.
     * @group Emits
     */
    readonly onDragStart = output<DragEvent>();
    /**
     * Callback to invoke when drag ends.
     * @param {DragEvent} event - Drag event.
     * @group Emits
     */
    readonly onDragEnd = output<DragEvent>();
    /**
     * Callback to invoke on dragging.
     * @param {DragEvent} event - Drag event.
     * @group Emits
     */
    readonly onDrag = output<DragEvent>();

    handle: any;

    dragListener: VoidListener;

    mouseDownListener: VoidListener;

    mouseUpListener: VoidListener;

    _pDraggableDisabled: boolean = false;

    constructor(
        public el: ElementRef,
        public zone: NgZone,
        private renderer: Renderer2
    ) {}

    @Input() get pDraggableDisabled(): boolean {
        return this._pDraggableDisabled;
    }
    set pDraggableDisabled(_pDraggableDisabled: boolean) {
        this._pDraggableDisabled = _pDraggableDisabled;

        if (this._pDraggableDisabled) {
            this.unbindMouseListeners();
        } else {
            this.el.nativeElement.draggable = true;
            this.bindMouseListeners();
        }
    }

    ngAfterViewInit() {
        if (!this.pDraggableDisabled) {
            this.el.nativeElement.draggable = true;
            this.bindMouseListeners();
        }
    }

    bindDragListener() {
        if (!this.dragListener) {
            this.zone.runOutsideAngular(() => {
                this.dragListener = this.renderer.listen(this.el.nativeElement, 'drag', this.drag.bind(this));
            });
        }
    }

    unbindDragListener() {
        if (this.dragListener) {
            this.zone.runOutsideAngular(() => {
                this.dragListener && this.dragListener();
                this.dragListener = null;
            });
        }
    }

    bindMouseListeners() {
        if (!this.mouseDownListener && !this.mouseUpListener) {
            this.zone.runOutsideAngular(() => {
                this.mouseDownListener = this.renderer.listen(this.el.nativeElement, 'mousedown', this.mousedown.bind(this));
                this.mouseUpListener = this.renderer.listen(this.el.nativeElement, 'mouseup', this.mouseup.bind(this));
            });
        }
    }

    unbindMouseListeners() {
        if (this.mouseDownListener && this.mouseUpListener) {
            this.zone.runOutsideAngular(() => {
                this.mouseDownListener && this.mouseDownListener();
                this.mouseUpListener && this.mouseUpListener();
                this.mouseDownListener = null;
                this.mouseUpListener = null;
            });
        }
    }

    drag(event: DragEvent) {
        this.onDrag.emit(event);
    }

    @HostListener('dragstart', ['$event'])
    dragStart(event: DragEvent) {
        if (this.allowDrag() && !this.pDraggableDisabled) {
            const dragEffect = this.dragEffect();
            if (dragEffect) {
                (event.dataTransfer as DataTransfer).effectAllowed = dragEffect;
            }
            (event.dataTransfer as DataTransfer).setData('text', this.scope()!);

            this.onDragStart.emit(event);

            this.bindDragListener();
        } else {
            event.preventDefault();
        }
    }

    @HostListener('dragend', ['$event'])
    dragEnd(event: DragEvent) {
        this.onDragEnd.emit(event);
        this.unbindDragListener();
    }

    mousedown(event: MouseEvent) {
        this.handle = event.target;
    }

    mouseup(event: MouseEvent) {
        this.handle = null;
    }

    allowDrag(): boolean {
        const dragHandle = this.dragHandle();
        if (dragHandle && this.handle) return DomHandler.matches(this.handle, dragHandle);
        else return true;
    }

    ngOnDestroy() {
        this.unbindDragListener();
        this.unbindMouseListeners();
    }
}
/**
 * hDroppable directive apply droppable behavior to any element.
 * @group Components
 */
@Directive({
    selector: '[hDroppable]',
    standalone: true
})
export class Droppable implements AfterViewInit, OnDestroy {
    readonly scope = input<string | string[]>(undefined, { alias: "hDroppable" });
    /**
     * Whether the element is droppable, useful for conditional cases.
     * @group Props
     */
    _pDroppableDisabled: boolean = false;

    @Input() get pDroppableDisabled(): boolean {
        return this._pDroppableDisabled;
    }
    set pDroppableDisabled(_pDroppableDisabled: boolean) {
        this._pDroppableDisabled = _pDroppableDisabled;

        if (this._pDroppableDisabled) {
            this.unbindDragOverListener();
        } else {
            this.bindDragOverListener();
        }
    }
    /**
     * Defines the cursor style, valid values are none, copy, move, link, copyMove, copyLink, linkMove and all.
     * @group Props
     */
    readonly dropEffect = input<'none' | 'copy' | 'link' | 'move'>();
    /**
     * Callback to invoke when a draggable enters drop area.
     * @group Emits
     */
    readonly onDragEnter = output<DragEvent>();
    /**
     * Callback to invoke when a draggable leave drop area.
     * @group Emits
     */
    readonly onDragLeave = output<DragEvent>();
    /**
     * Callback to invoke when a draggable is dropped onto drop area.
     * @group Emits
     */
    readonly onDrop = output<DragEvent>();

    constructor(
        public el: ElementRef,
        public zone: NgZone,
        private renderer: Renderer2
    ) {}

    dragOverListener: VoidListener;

    ngAfterViewInit() {
        if (!this.pDroppableDisabled) {
            this.bindDragOverListener();
        }
    }

    bindDragOverListener() {
        if (!this.dragOverListener) {
            this.zone.runOutsideAngular(() => {
                this.dragOverListener = this.renderer.listen(this.el.nativeElement, 'dragover', this.dragOver.bind(this));
            });
        }
    }

    unbindDragOverListener() {
        if (this.dragOverListener) {
            this.zone.runOutsideAngular(() => {
                this.dragOverListener && this.dragOverListener();
                this.dragOverListener = null;
            });
        }
    }

    dragOver(event: DragEvent) {
        event.preventDefault();
    }

    @HostListener('drop', ['$event'])
    drop(event: DragEvent) {
        if (this.allowDrop(event)) {
            removeClass(this.el.nativeElement, 'p-draggable-enter');
            event.preventDefault();
            this.onDrop.emit(event);
        }
    }

    @HostListener('dragenter', ['$event'])
    dragEnter(event: DragEvent) {
        event.preventDefault();

        const dropEffect = this.dropEffect();
        if (dropEffect) {
            (event.dataTransfer as DataTransfer).dropEffect = dropEffect;
        }

        addClass(this.el.nativeElement, 'p-draggable-enter');
        this.onDragEnter.emit(event);
    }

    @HostListener('dragleave', ['$event'])
    dragLeave(event: DragEvent) {
        event.preventDefault();

        if (!this.el.nativeElement.contains(event.relatedTarget)) {
            removeClass(this.el.nativeElement, 'p-draggable-enter');
            this.onDragLeave.emit(event);
        }
    }

    allowDrop(event: DragEvent): boolean {
        let dragScope = (event.dataTransfer as DataTransfer).getData('text');
        const scope = this.scope();
        if (typeof scope == 'string' && dragScope == scope) {
            return true;
        } else if (Array.isArray(scope)) {
            for (let j = 0; j < scope.length; j++) {
                if (dragScope == scope[j]) {
                    return true;
                }
            }
        }
        return false;
    }

    ngOnDestroy() {
        this.unbindDragOverListener();
    }
}

@NgModule({
    imports: [Draggable, Droppable],
    exports: [Draggable, Droppable]
})
export class DragDropModule {}
