import * as api from './public-api';

describe('@gravionlabs/helix-desktop', () => {
  it('exports its version', () => {
    expect(api.HELIX_DESKTOP_VERSION).toBe('0.1.0');
  });
});
