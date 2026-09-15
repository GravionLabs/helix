export const style = /*css*/ `
    .h-paginator {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        background: dt('paginator.background');
        color: dt('paginator.color');
        padding: dt('paginator.padding');
        border-radius: dt('paginator.border.radius');
        gap: dt('paginator.gap');
    }

    .h-paginator-content {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: dt('paginator.gap');
    }

    .h-paginator-content-start {
        margin-inline-end: auto;
    }

    .h-paginator-content-end {
        margin-inline-start: auto;
    }

    .h-paginator-page,
    .h-paginator-next,
    .h-paginator-last,
    .h-paginator-first,
    .h-paginator-prev {
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        user-select: none;
        overflow: hidden;
        position: relative;
        background: dt('paginator.nav.button.background');
        border: 0 none;
        color: dt('paginator.nav.button.color');
        min-width: dt('paginator.nav.button.width');
        height: dt('paginator.nav.button.height');
        transition:
            background dt('paginator.transition.duration'),
            color dt('paginator.transition.duration'),
            outline-color dt('paginator.transition.duration'),
            box-shadow dt('paginator.transition.duration');
        border-radius: dt('paginator.nav.button.border.radius');
        padding: 0;
        margin: 0;
    }

    .h-paginator-page:focus-visible,
    .h-paginator-next:focus-visible,
    .h-paginator-last:focus-visible,
    .h-paginator-first:focus-visible,
    .h-paginator-prev:focus-visible {
        box-shadow: dt('paginator.nav.button.focus.ring.shadow');
        outline: dt('paginator.nav.button.focus.ring.width') dt('paginator.nav.button.focus.ring.style') dt('paginator.nav.button.focus.ring.color');
        outline-offset: dt('paginator.nav.button.focus.ring.offset');
    }

    .h-paginator-page:not(.h-disabled):not(.h-paginator-page-selected):hover,
    .h-paginator-first:not(.h-disabled):hover,
    .h-paginator-prev:not(.h-disabled):hover,
    .h-paginator-next:not(.h-disabled):hover,
    .h-paginator-last:not(.h-disabled):hover {
        background: dt('paginator.nav.button.hover.background');
        color: dt('paginator.nav.button.hover.color');
    }

    .h-paginator-page.h-paginator-page-selected {
        background: dt('paginator.nav.button.selected.background');
        color: dt('paginator.nav.button.selected.color');
    }

    .h-paginator-current {
        color: dt('paginator.current.page.report.color');
    }

    .h-paginator-pages {
        display: flex;
        align-items: center;
        gap: dt('paginator.gap');
    }

    .h-paginator-jtp-input .h-inputtext {
        max-width: dt('paginator.jump.to.page.input.max.width');
    }

    .h-paginator-first:dir(rtl),
    .h-paginator-prev:dir(rtl),
    .h-paginator-next:dir(rtl),
    .h-paginator-last:dir(rtl) {
        transform: rotate(180deg);
    }
`;
