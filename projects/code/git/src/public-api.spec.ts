import * as api from './public-api';

describe('@gravionlabs/helix-code/git', () => {
  it('exports its version', () => {
    expect(api.HELIX_CODE_GIT_VERSION).toBe('0.1.0');
  });
});
