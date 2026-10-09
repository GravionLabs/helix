import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type HxAvatarSize = 'normal' | 'large' | 'xlarge';
export type HxAvatarShape = 'square' | 'circle';

/**
 * A picture, initials or an icon for a person. `image` wins over `icon`, which wins over `label`.
 *
 * ```html
 * <hx-avatar image="/amy.png" ariaLabel="Amy Elsner" shape="circle" />
 * <hx-avatar label="JK" size="large" />
 * <hx-avatar icon="pi pi-user" />
 * ```
 *
 * With `ariaLabel` the avatar is a named `img` and what it draws is hidden from assistive technology; without it,
 * initials are read as text and a picture is decorative (empty `alt`), so name any avatar that stands alone.
 */
@Component({
  selector: 'hx-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-avatar',
    '[attr.role]': "ariaLabel() ? 'img' : null",
    '[attr.aria-label]': 'ariaLabel() || null',
    '[class.hx-avatar-lg]': "size() === 'large'",
    '[class.hx-avatar-xl]': "size() === 'xlarge'",
    '[class.hx-avatar-circle]': "shape() === 'circle'",
  },
  template: `
    @if (image()) {
      <img class="hx-avatar-image" [src]="image()" alt="" />
    } @else if (icon()) {
      <span class="hx-avatar-icon" [class]="icon()" aria-hidden="true"></span>
    } @else if (label()) {
      <span class="hx-avatar-label" [attr.aria-hidden]="ariaLabel() ? 'true' : null">{{ label() }}</span>
    } @else {
      <ng-content />
    }
  `,
})
export class HxAvatar {
  /** Initials or a short text. */
  readonly label = input<string>();
  /** CSS classes of an icon font, e.g. `pi pi-user`. */
  readonly icon = input<string>();
  /** Address of a picture. */
  readonly image = input<string>();
  readonly size = input<HxAvatarSize>('normal');
  readonly shape = input<HxAvatarShape>('square');
  /** Accessible name; makes the avatar a named `img`. */
  readonly ariaLabel = input<string>();
}

/**
 * Overlaps the avatars it contains, e.g. the people of a team, with a ring in the surface colour between them.
 *
 * ```html
 * <hx-avatar-group ariaLabel="Team">
 *   <hx-avatar image="/a.png" shape="circle" />
 *   <hx-avatar label="+2" shape="circle" />
 * </hx-avatar-group>
 * ```
 */
@Component({
  selector: 'hx-avatar-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-avatar-group', role: 'group', '[attr.aria-label]': 'ariaLabel() || null' },
  template: '<ng-content />',
})
export class HxAvatarGroup {
  /** Accessible name of the group. */
  readonly ariaLabel = input<string>();
}
