import { getHxPlatform, setHxPlatform } from './platform';

describe('platform', () => {
  it('reads data-platform and falls back to web', () => {
    const root = document.createElement('html');
    expect(getHxPlatform(root)).toBe('web');
    root.setAttribute('data-platform', 'nonsense');
    expect(getHxPlatform(root)).toBe('web');
    setHxPlatform('mobile', root);
    expect(root.getAttribute('data-platform')).toBe('mobile');
    expect(getHxPlatform(root)).toBe('mobile');
  });

  it('keeps the desktop shell for a narrow desktop window', () => {
    const root = document.createElement('html');
    setHxPlatform('desktop', root);
    expect(getHxPlatform(root)).toBe('desktop');
  });
});
