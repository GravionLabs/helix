import { helixGridTheme } from './helix-theme';

describe('helixGridTheme', () => {
  it('is an AG Grid theme that can be refined further', () => {
    expect(helixGridTheme).toBeTruthy();
    expect(typeof helixGridTheme.withParams).toBe('function');
    expect(typeof helixGridTheme.withPart).toBe('function');
    expect(helixGridTheme.withParams({ rowHeight: 30 })).not.toBe(helixGridTheme);
  });
});
