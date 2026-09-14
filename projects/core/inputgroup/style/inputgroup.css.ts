export const style = /*css*/ `
    .h-inputgroup,
    .h-inputgroup .h-iconfield,
    .h-inputgroup .h-floatlabel,
    .h-inputgroup .h-iftalabel {
        display: flex;
        align-items: stretch;
        width: 100%;
    }

    .h-inputgroup .h-floatlabel .h-inputwrapper,
    .h-inputgroup .h-iftalabel .h-inputwrapper {
        display: inline-flex;
    }

    .h-inputgroup .h-inputtext,
    .h-inputgroup .h-inputwrapper {
        flex: 1 1 auto;
        width: 1%;
    }

    .h-inputgroupaddon {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: dt('inputgroup.addon.padding');
        background: dt('inputgroup.addon.background');
        color: dt('inputgroup.addon.color');
        border-block-start: 1px solid dt('inputgroup.addon.border.color');
        border-block-end: 1px solid dt('inputgroup.addon.border.color');
        min-width: dt('inputgroup.addon.min.width');
    }

    .h-inputgroupaddon:first-child,
    .h-inputgroupaddon + .h-inputgroupaddon {
        border-inline-start: 1px solid dt('inputgroup.addon.border.color');
    }

    .h-inputgroupaddon:last-child {
        border-inline-end: 1px solid dt('inputgroup.addon.border.color');
    }

    .h-inputgroupaddon:has(.h-button) {
        padding: 0;
        overflow: hidden;
    }

    .h-inputgroupaddon .h-button {
        border-radius: 0;
    }

    .h-inputgroup > .h-component,
    .h-inputgroup > .h-inputwrapper > .h-component,
    .h-inputgroup > .h-iconfield > .h-component,
    .h-inputgroup > .h-floatlabel > .h-component,
    .h-inputgroup > .h-floatlabel > .h-inputwrapper > .h-component,
    .h-inputgroup > .h-iftalabel > .h-component,
    .h-inputgroup > .h-iftalabel > .h-inputwrapper > .h-component {
        border-radius: 0;
        margin: 0;
    }

    .h-inputgroupaddon:first-child,
    .h-inputgroup > .h-component:first-child,
    .h-inputgroup > .h-inputwrapper:first-child > .h-component,
    .h-inputgroup > .h-iconfield:first-child > .h-component,
    .h-inputgroup > .h-floatlabel:first-child > .h-component,
    .h-inputgroup > .h-floatlabel:first-child > .h-inputwrapper > .h-component,
    .h-inputgroup > .h-iftalabel:first-child > .h-component,
    .h-inputgroup > .h-iftalabel:first-child > .h-inputwrapper > .h-component {
        border-start-start-radius: dt('inputgroup.addon.border.radius');
        border-end-start-radius: dt('inputgroup.addon.border.radius');
    }

    .h-inputgroupaddon:last-child,
    .h-inputgroup > .h-component:last-child,
    .h-inputgroup > .h-inputwrapper:last-child > .h-component,
    .h-inputgroup > .h-iconfield:last-child > .h-component,
    .h-inputgroup > .h-floatlabel:last-child > .h-component,
    .h-inputgroup > .h-floatlabel:last-child > .h-inputwrapper > .h-component,
    .h-inputgroup > .h-iftalabel:last-child > .h-component,
    .h-inputgroup > .h-iftalabel:last-child > .h-inputwrapper > .h-component {
        border-start-end-radius: dt('inputgroup.addon.border.radius');
        border-end-end-radius: dt('inputgroup.addon.border.radius');
    }

    .h-inputgroup .h-component:focus,
    .h-inputgroup .h-component.h-focus,
    .h-inputgroup .h-inputwrapper-focus,
    .h-inputgroup .h-component:focus ~ label,
    .h-inputgroup .h-component.h-focus ~ label,
    .h-inputgroup .h-inputwrapper-focus ~ label,
    .h-inputgroup .h-floatlabel .h-inputwrapper ~ label,
    .h-inputgroup .h-iftalabel .h-inputwrapper ~ label {
        z-index: 1;
    }

    .h-inputgroup > .h-button:not(.h-button-icon-only) {
        width: auto;
    }

    .h-inputgroup .h-iconfield + .h-iconfield .h-inputtext {
        border-inline-start: 0;
    }
`;
