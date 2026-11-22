import { InjectionToken } from '@angular/core';
import { LanguageDescription, type LanguageSupport } from '@codemirror/language';
import { languages as allLanguages } from '@codemirror/language-data';

/**
 * The languages an `hx-code-editor` knows. Defaults to `@codemirror/language-data`; provide a
 * shorter list to leave out grammars. Only the editor reads it and passes it to the functions.
 */
export const HX_CODE_LANGUAGES = new InjectionToken<readonly LanguageDescription[]>(
  'HX_CODE_LANGUAGES',
  { providedIn: 'root', factory: () => allLanguages },
);

/** The `LanguageDescription` for a file name or path, or `null` when none matches. */
export function hxLanguageFor(
  path: string,
  languages: readonly LanguageDescription[] = allLanguages,
): LanguageDescription | null {
  const name = path.split(/[\\/]/).pop() ?? path;
  if (!name) return null;
  return LanguageDescription.matchFilename(languages, name);
}

/**
 * Loads the `LanguageSupport` for a file name; the grammar is a lazy chunk.
 * Resolves to `null` when no language matches or the load fails; it never throws.
 */
export async function hxLoadLanguage(
  path: string,
  languages: readonly LanguageDescription[] = allLanguages,
): Promise<LanguageSupport | null> {
  const description = hxLanguageFor(path, languages);
  if (!description) return null;
  try {
    return await description.load();
  } catch {
    return null;
  }
}
