import { Pipe, type PipeTransform } from '@angular/core';
import type { ValidationErrors } from '@angular/forms';

@Pipe({ name: 'helixFirstError', standalone: true, pure: true })
export class HelixFirstError implements PipeTransform {
  transform(errors: ValidationErrors | null | undefined): string {
    if (!errors) return '';
    const first = Object.values(errors)[0];
    return typeof first === 'string' ? first : '';
  }
}
