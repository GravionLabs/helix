import { TestBed } from '@angular/core/testing';
import { LanguageDescription, type LanguageSupport } from '@codemirror/language';
import { HX_CODE_LANGUAGES, hxLanguageFor, hxLoadLanguage } from './language';

describe('language', () => {
  describe('hxLanguageFor', () => {
    it('matches a file name by extension', () => {
      expect(hxLanguageFor('src/app/app.ts')?.name).toBe('TypeScript');
      expect(hxLanguageFor('styles.css')?.name).toBe('CSS');
    });

    it('matches a file name by pattern and Windows paths', () => {
      expect(hxLanguageFor('Dockerfile')?.name).toBe('Dockerfile');
      expect(hxLanguageFor('C:\\work\\main.rs')?.name).toBe('Rust');
    });

    it('returns null when nothing matches', () => {
      expect(hxLanguageFor('notes.unknownext')).toBeNull();
      expect(hxLanguageFor('README')).toBeNull();
      expect(hxLanguageFor('')).toBeNull();
    });

    it('uses the given list instead of language-data', () => {
      const only = [LanguageDescription.of({ name: 'Only', extensions: ['only'], load: load() })];
      expect(hxLanguageFor('a.only', only)?.name).toBe('Only');
      expect(hxLanguageFor('a.ts', only)).toBeNull();
    });
  });

  describe('hxLoadLanguage', () => {
    it('resolves to the language support', async () => {
      const support = await hxLoadLanguage('a.json');
      expect(support?.language.name).toBe('json');
    });

    it('resolves to null when no language matches', async () => {
      expect(await hxLoadLanguage('a.unknownext')).toBeNull();
    });

    it('resolves to null when the load fails', async () => {
      const broken = [
        LanguageDescription.of({
          name: 'Broken',
          extensions: ['bad'],
          load: () => Promise.reject(new Error('chunk failed')),
        }),
      ];
      expect(await hxLoadLanguage('a.bad', broken)).toBeNull();
    });
  });

  describe('HX_CODE_LANGUAGES', () => {
    it('defaults to language-data and can be replaced', () => {
      expect(TestBed.inject(HX_CODE_LANGUAGES).length).toBeGreaterThan(50);
      const short = [LanguageDescription.of({ name: 'X', extensions: ['x'], load: load() })];
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [{ provide: HX_CODE_LANGUAGES, useValue: short }],
      });
      expect(TestBed.inject(HX_CODE_LANGUAGES)).toBe(short);
    });
  });
});

function load(): () => Promise<LanguageSupport> {
  return () => Promise.reject(new Error('not loaded'));
}
