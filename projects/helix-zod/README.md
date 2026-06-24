# @gravionlabs/helix-zod

Zod v4 adapter for `@gravionlabs/helix` form validation. Converts a Zod field schema into an Angular `ValidatorFn` that emits `HelixValidatorKey`-keyed `ValidationErrors` — compatible with `HelixFormField`, `HelixFirstError`, and `helixFormErrorMap` out of the box.

---

## Peer Dependencies

| Package | Version |
|---|---|
| `zod` | `^4.0.0` |
| `@gravionlabs/helix` | `>=0.2.0` |
| `@angular/forms` | `>=21` |

---

## Installation

This is a workspace library — no `npm install` needed. The path alias is already registered in `tsconfig.json`:

```json
"@gravionlabs/helix-zod": ["./projects/helix-zod/src/public-api.ts"]
```

Import directly in your application:

```ts
import { HelixZodValidators } from '@gravionlabs/helix-zod';
```

---

## Quick Start

```ts
import { z } from 'zod';
import { HelixZodValidators } from '@gravionlabs/helix-zod';

// Wrap any Zod field schema in a reactive form control
form = this.fb.group({
  email: ['', HelixZodValidators.fromZod(z.string().email('Invalid email'))],
  name:  ['', HelixZodValidators.fromZod(z.string().min(1, 'Required'), { allowEmpty: false })],
});
```

`HelixFormField` reads the resulting `ValidationErrors` keys directly — no template changes required.

---

## API

### `HelixZodValidators.fromZod(schema, options?)`

Converts a Zod field schema into a Helix-compatible Angular `ValidatorFn`.

```ts
import type { ValidatorFn } from '@angular/forms';
import type { ZodSchema } from 'zod';
import type { ZodHelixOptions } from '@gravionlabs/helix-zod';

fromZod(schema: ZodSchema, options?: ZodHelixOptions): ValidatorFn
```

**Parameters**

| Parameter | Type | Description |
|---|---|---|
| `schema` | `ZodSchema` | A Zod field schema. Prefer `UserSchema.shape.email` over a full object schema. Do **not** pass schemas with `.transform()` — use the pre-transform shape for form controls. |
| `options` | `ZodHelixOptions` | Optional configuration (see below). |

### `ZodHelixOptions`

```ts
export interface ZodHelixOptions {
  fallbackKey?: HelixValidatorKey; // required when schema uses .refine() / .superRefine()
  allowEmpty?: boolean;            // default: true
}
```

---

## Zod v4 → `HelixValidatorKey` Mapping

> This library targets **Zod v4**. Zod v4 introduced breaking changes from v3:
> `invalid_string` → `invalid_format` (with a `format` property), `too_small`/`too_big` use `origin` instead of `type`, and `not_integer` was replaced by `invalid_type` with `expected: 'int'`.

| Zod v4 issue code | Condition | `HelixValidatorKey` |
|---|---|---|
| `invalid_type` | value is `''`, `null`, or `undefined` | `Required` |
| `invalid_type` | `expected === 'int'` | `Integer` |
| `invalid_type` | `expected === 'number'` / `'float'` | `Number` |
| `invalid_format` | `format === 'email'` | `Email` |
| `invalid_format` | `format === 'regex'` | `Pattern` |
| `invalid_format` | `format === 'datetime'` / `'date'` / `'time'` | `Date` |
| `too_small` | `origin === 'string'` or `'array'` | `MinLength` |
| `too_big` | `origin === 'string'` or `'array'` | `MaxLength` |
| `too_small` | `origin === 'number'` | `Min` |
| `too_big` | `origin === 'number'` | `Max` |
| `custom` | — | requires `fallbackKey` (see below) |
| anything else | — | requires `fallbackKey` (see below) |

All issues from a single `safeParse` are processed simultaneously, producing one error key per issue — equivalent to stacking multiple `HelixValidators` calls.

### Known gaps — no automatic mapping

| Scenario | Recommendation |
|---|---|
| `z.enum()` → `invalid_value` | Use `fallbackKey` or keep using `HelixValidators.oneOf` |
| `z.array()` item-level errors | Use `fallbackKey` or `HelixValidators.allOf` |
| `invalid_type` for `boolean` | Helix has no `Boolean` key — use `fallbackKey` |

---

## `allowEmpty` Behaviour

`HelixValidators` defaults to `allowEmpty = true`: validation passes silently on empty values. `fromZod` mirrors this:

| Scenario | Recommended pattern |
|---|---|
| Optional field with format check | Default `allowEmpty: true` — empty passes, invalid format shows error |
| Mandatory field (required + format) | Stack `HelixValidators.required('msg')` alongside `fromZod(schema)` |
| Required via Zod only | `allowEmpty: false` — empty triggers `Required` (null/undefined) or `MinLength` (empty string) |

```ts
// Optional — empty passes, bad format shows Email error
HelixZodValidators.fromZod(z.string().email('Invalid email'))

// Required — must have a value; empty string → MinLength, null → Required
HelixZodValidators.fromZod(z.string().min(1, 'Name is required'), { allowEmpty: false })

// Stacked — explicit required message + Zod format check
[
  HelixValidators.required('Email is required'),
  HelixZodValidators.fromZod(z.string().email('Invalid email')),
]
```

**Note:** when `allowEmpty: false` and the value is `null` or `undefined`, Zod emits `invalid_type` with its default mismatch message, not the message from `.min()` or `.email()`. Stack `HelixValidators.required('...')` for a custom required message.

---

## `.refine()` and `fallbackKey`

`.refine()` and `.superRefine()` produce `ZodIssueCode.custom`, which has no automatic `HelixValidatorKey` mapping. Provide a `fallbackKey` to capture these errors:

```ts
const bannedUsernames = ['admin', 'root', 'system'];

HelixZodValidators.fromZod(
  z.string()
    .min(3, 'At least 3 characters')
    .refine((v) => !bannedUsernames.includes(v), 'Username is not allowed'),
  { fallbackKey: HelixValidatorKey.Pattern },
)
```

**Missing `fallbackKey` behaviour:**

- **Development** (`ngDevMode = true`): throws a descriptive error identifying the unmapped issue code and the failing issue JSON.
- **Production** (`ngDevMode = false`): the unmapped issue is silently skipped. The control remains invalid if other issues produce mapped errors.

---

## Component Example

```ts
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { z } from 'zod';
import { HelixFormField, HelixValidators, HelixValidatorKey } from '@gravionlabs/helix';
import { HelixZodValidators } from '@gravionlabs/helix-zod';

// Define your schema once — reuse it for both API parsing and form validation
const UserSchema = z.object({
  email: z.string().email('Invalid email'),
  name:  z.string().min(1, 'Name is required'),
});

const bannedUsernames = ['admin', 'root'];

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, HelixFormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <helix-form-field label="Email" [control]="form.controls.email">
        <input type="email" formControlName="email" />
      </helix-form-field>

      <helix-form-field label="Name" [control]="form.controls.name">
        <input type="text" formControlName="name" />
      </helix-form-field>

      <helix-form-field label="Username" [control]="form.controls.username">
        <input type="text" formControlName="username" />
      </helix-form-field>

      <button type="submit" [disabled]="form.invalid">Register</button>
    </form>
  `,
})
export class RegisterComponent {
  readonly #fb = inject(FormBuilder);

  form = this.#fb.group({
    // Stack required + Zod for a custom required message
    email: [
      '',
      [
        HelixValidators.required('Email is required'),
        HelixZodValidators.fromZod(UserSchema.shape.email),
      ],
    ],

    // allowEmpty: false — Zod handles both empty and format validation
    name: [
      '',
      HelixZodValidators.fromZod(UserSchema.shape.name, { allowEmpty: false }),
    ],

    // .refine() requires fallbackKey
    username: [
      '',
      HelixZodValidators.fromZod(
        z.string()
          .min(3, 'At least 3 characters')
          .refine((v) => !bannedUsernames.includes(v), 'Username is not allowed'),
        { fallbackKey: HelixValidatorKey.Pattern },
      ),
    ],
  });

  protected onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // Parse the form value through the full schema for the API call
    const payload = UserSchema.parse(this.form.value);
    console.log(payload);
  }
}
```

### How errors surface in `HelixFormField`

`HelixFormField` reads `control.errors` and takes the first string value. Since `fromZod` stores the Zod error message as the value (e.g. `{ Email: 'Invalid email' }`), `activeError` picks it up with no adapter layer.

```ts
// helixFormErrorMap also works identically
import { helixFormErrorMap } from '@gravionlabs/helix';
const errors = helixFormErrorMap(this.form);
// → { email: 'Invalid email', name: 'Name is required' }
```

---

## `UserSchema.shape` — Single Source of Truth

Using `UserSchema.shape.<field>` directly in `fromZod` eliminates duplicated validation rules between your API schema and your form:

```ts
// Without shape — rules written twice
z.string().email()              // API parsing
HelixValidators.email('...')    // form (same rule, again)

// With shape — one definition drives both
HelixZodValidators.fromZod(UserSchema.shape.email)
```

> Do **not** pass fields with `.transform()` (e.g. a Luxon `IsoDateTime` field) into form controls. Use the input-only (pre-transform) field shape instead, or define a separate schema without the transform.

---

## Running Tests

```bash
# Run helix-zod tests
pnpm ng test helix-zod

# Run all library tests
pnpm test:lib
```

Tests are written with [Vitest](https://vitest.dev) and cover all mapped issue codes, `allowEmpty` behaviour, `fallbackKey` usage, and the dev/prod error modes.

---

## Architecture Notes

This library is the `@gravionlabs/helix-zod` portion of the broader Zod integration architecture documented in [`ZOD_ARCHITECTURE_HELIX.md`](../../ZOD_ARCHITECTURE_HELIX.md) at the repo root. The arch doc also covers:

- App-level patterns: domain schemas, `UserSchema.shape`, schema composition
- REST endpoint validation with `HttpClient` and `httpResource`
- Luxon `IsoDateTime` transform schema
- Environment config validation at startup
- Generic `zodFieldValidator` (framework-agnostic, no `HelixValidatorKey` dependency)

Those patterns live in your application (`src/app/schemas/`, `src/app/api/`, etc.) — this library provides only the Angular `ValidatorFn` bridge.

### Implementation vs Architecture Plan

The library fully implements the `helix-zod` scope defined in `ZOD_ARCHITECTURE_HELIX.md §6b`:

| Plan item | Status |
|---|---|
| `ZodHelixOptions` interface (`fallbackKey`, `allowEmpty`) | Implemented |
| `HelixZodValidators.fromZod()` factory | Implemented |
| Full Zod v4 issue → `HelixValidatorKey` mapping | Implemented |
| `allowEmpty = true` default mirroring `HelixValidators` | Implemented |
| `ngDevMode` throw on unmapped issue without `fallbackKey` | Implemented |
| Silent skip in production builds | Implemented |
| `z.array().min()` → `MinLength` | Implemented |
| App-level patterns (schemas, API services, Luxon) | Out of scope — application layer |
