export const style = /*css*/ `
    .h-password {
        display: inline-flex;
        position: relative;
    }

    .h-password .h-password-overlay {
        min-width: 100%;
    }

    .h-password-meter {
        height: dt('password.meter.height');
        background: dt('password.meter.background');
        border-radius: dt('password.meter.border.radius');
    }

    .h-password-meter-label {
        height: 100%;
        width: 0;
        transition: width 1s ease-in-out;
        border-radius: dt('password.meter.border.radius');
    }

    .h-password-meter-weak {
        background: dt('password.strength.weak.background');
    }

    .h-password-meter-medium {
        background: dt('password.strength.medium.background');
    }

    .h-password-meter-strong {
        background: dt('password.strength.strong.background');
    }

    .h-password-fluid {
        display: flex;
    }

    .h-password-fluid .h-password-input {
        width: 100%;
    }

    .h-password-input::-ms-reveal,
    .h-password-input::-ms-clear {
        display: none;
    }

    .h-password-overlay {
        padding: dt('password.overlay.padding');
        background: dt('password.overlay.background');
        color: dt('password.overlay.color');
        border: 1px solid dt('password.overlay.border.color');
        box-shadow: dt('password.overlay.shadow');
        border-radius: dt('password.overlay.border.radius');
    }

    .h-password-content {
        display: flex;
        flex-direction: column;
        gap: dt('password.content.gap');
    }

    .h-password-toggle-mask-icon {
        inset-inline-end: dt('form.field.padding.x');
        color: dt('password.icon.color');
        position: absolute;
        top: 50%;
        margin-top: calc(-1 * calc(dt('icon.size') / 2));
        width: dt('icon.size');
        height: dt('icon.size');
    }

    .h-password-clear-icon {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        cursor: pointer;
        inset-inline-end: dt('form.field.padding.x');
        color: dt('form.field.icon.color');
    }

    .h-password:has(.h-password-toggle-mask-icon) .h-password-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .h-password:has(.h-password-toggle-mask-icon) .h-password-clear-icon {
        inset-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .h-password:has(.h-password-clear-icon) .h-password-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .h-password:has(.h-password-clear-icon):has(.h-password-toggle-mask-icon)  .h-password-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 3) + calc(dt('icon.size') * 2));
    }

`;
