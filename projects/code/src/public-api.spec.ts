import * as api from './public-api';

describe('@gravionlabs/helix-code', () => {
  it('exports its version', () => {
    expect(api.HELIX_CODE_VERSION).toBe('0.1.0');
  });
});
