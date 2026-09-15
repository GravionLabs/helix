export const style = /*css*/ `
    .h-avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: dt('avatar.width');
        height: dt('avatar.height');
        font-size: dt('avatar.font.size');
        background: dt('avatar.background');
        color: dt('avatar.color');
        border-radius: dt('avatar.border.radius');
    }

    .h-avatar-image {
        background: transparent;
    }

    .h-avatar-circle {
        border-radius: 50%;
    }

    .h-avatar-circle img {
        border-radius: 50%;
    }

    .h-avatar-icon {
        font-size: dt('avatar.icon.size');
        width: dt('avatar.icon.size');
        height: dt('avatar.icon.size');
    }

    .h-avatar img {
        width: 100%;
        height: 100%;
    }

    .h-avatar-lg {
        width: dt('avatar.lg.width');
        height: dt('avatar.lg.width');
        font-size: dt('avatar.lg.font.size');
    }

    .h-avatar-lg .h-avatar-icon {
        font-size: dt('avatar.lg.icon.size');
        width: dt('avatar.lg.icon.size');
        height: dt('avatar.lg.icon.size');
    }

    .h-avatar-xl {
        width: dt('avatar.xl.width');
        height: dt('avatar.xl.width');
        font-size: dt('avatar.xl.font.size');
    }

    .h-avatar-xl .h-avatar-icon {
        font-size: dt('avatar.xl.icon.size');
        width: dt('avatar.xl.icon.size');
        height: dt('avatar.xl.icon.size');
    }

    .h-avatar-group {
        display: flex;
        align-items: center;
    }

    .h-avatar-group .h-avatar + .h-avatar {
        margin-inline-start: dt('avatar.group.offset');
    }

    .h-avatar-group .h-avatar {
        border: 2px solid dt('avatar.group.border.color');
    }

    .h-avatar-group .h-avatar-lg + .h-avatar-lg {
        margin-inline-start: dt('avatar.lg.group.offset');
    }

    .h-avatar-group .h-avatar-xl + .h-avatar-xl {
        margin-inline-start: dt('avatar.xl.group.offset');
    }
`;
