export const style = /*css*/ `
    .h-tree {
        display: block;
        background: dt('tree.background');
        color: dt('tree.color');
        padding: dt('tree.padding');
        position: relative;
    }

    .h-tree-root-children,
    .h-tree-node-children {
        display: flex;
        list-style-type: none;
        flex-direction: column;
        margin: 0;
        gap: dt('tree.gap');
    }

    .h-tree-root-children {
        padding: 0;
        padding-block-start: dt('tree.gap');
    }

    .h-tree-node-children {
        padding: 0;
        padding-block-start: dt('tree.gap');
        padding-inline-start: dt('tree.indent');
    }

    .h-tree-node {
        padding: 0;
        outline: 0 none;
    }

    .h-tree-node-content {
        border-radius: dt('tree.node.border.radius');
        padding: dt('tree.node.padding');
        display: flex;
        align-items: center;
        outline-color: transparent;
        color: dt('tree.node.color');
        gap: dt('tree.node.gap');
        transition:
            background dt('tree.transition.duration'),
            color dt('tree.transition.duration'),
            outline-color dt('tree.transition.duration'),
            box-shadow dt('tree.transition.duration');
    }

    .h-tree-node-content[data-h-dragging] {
        outline: 1px dashed dt('primary.color');
        outline-offset: -1px;
    }

    .h-tree-node-content[data-pc-section="drag-image"] {
        background: dt('tree.background');
    }

    .h-tree-node:focus-visible > .h-tree-node-content {
        box-shadow: dt('tree.node.focus.ring.shadow');
        outline: dt('tree.node.focus.ring.width') dt('tree.node.focus.ring.style') dt('tree.node.focus.ring.color');
        outline-offset: dt('tree.node.focus.ring.offset');
    }

    .h-tree-node-content.h-tree-node-selectable:not(.h-tree-node-selected):hover {
        background: dt('tree.node.hover.background');
        color: dt('tree.node.hover.color');
    }

    .h-tree-node-content.h-tree-node-selectable:not(.h-tree-node-selected):hover .h-tree-node-icon {
        color: dt('tree.node.icon.hover.color');
    }

    .h-tree-node-content.h-tree-node-selected {
        background: dt('tree.node.selected.background');
        color: dt('tree.node.selected.color');
    }

    .h-tree-node-content.h-tree-node-selected .h-tree-node-toggle-button {
        color: inherit;
    }

    .h-tree-node-content.h-tree-node-dragover {
        background: dt('tree.node.hover.background');
        color: dt('tree.node.hover.color');
    }

    .h-tree-node-content:focus-visible,
    .h-tree-node-content.h-tree-node-contextmenu-selected {
        box-shadow: dt('tree.node.focus.ring.shadow');
        outline: dt('tree.node.focus.ring.width') dt('tree.node.focus.ring.style') dt('tree.node.focus.ring.color');
        outline-offset: dt('tree.node.focus.ring.offset');
    }

    .h-tree-node-drop-point {
		outline: 1px solid dt('primary.color');
	}

    .h-tree-node-toggle-button {
        cursor: pointer;
        user-select: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        flex-shrink: 0;
        width: dt('tree.node.toggle.button.size');
        height: dt('tree.node.toggle.button.size');
        color: dt('tree.node.toggle.button.color');
        border: 0 none;
        background: transparent;
        border-radius: dt('tree.node.toggle.button.border.radius');
        transition:
            background dt('tree.transition.duration'),
            color dt('tree.transition.duration'),
            border-color dt('tree.transition.duration'),
            outline-color dt('tree.transition.duration'),
            box-shadow dt('tree.transition.duration');
        outline-color: transparent;
        padding: 0;
    }

    .h-tree-node-toggle-button:enabled:hover {
        background: dt('tree.node.toggle.button.hover.background');
        color: dt('tree.node.toggle.button.hover.color');
    }

    .h-tree-node-content.h-tree-node-selected .h-tree-node-toggle-button:hover {
        background: dt('tree.node.toggle.button.selected.hover.background');
        color: dt('tree.node.toggle.button.selected.hover.color');
    }

    .h-tree-root {
        overflow: auto;
    }

    .h-tree-node-selectable {
        cursor: pointer;
        user-select: none;
    }

    .h-tree-node-leaf > .h-tree-node-content .h-tree-node-toggle-button {
        visibility: hidden;
    }

    .h-tree-node-icon {
        color: dt('tree.node.icon.color');
        transition: color dt('tree.transition.duration');
    }

    .h-tree-node-content.h-tree-node-selected .h-tree-node-icon {
        color: dt('tree.node.icon.selected.color');
    }

    .h-tree-filter {
        margin: dt('tree.filter.margin');
    }

    .h-tree-filter-input {
        width: 100%;
    }

    .h-tree-loading-icon {
        font-size: dt('tree.loading.icon.size');
        width: dt('tree.loading.icon.size');
        height: dt('tree.loading.icon.size');
    }

    .h-tree .h-tree-mask {
        position: absolute;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .h-tree-flex-scrollable {
        display: flex;
        flex: 1;
        height: 100%;
        flex-direction: column;
    }

    .h-tree-flex-scrollable .h-tree-root {
        flex: 1;
    }
`;
