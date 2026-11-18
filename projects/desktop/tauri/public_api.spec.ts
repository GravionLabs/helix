import { HELIX_DESKTOP_TAURI } from './public_api';

describe('@gravionlabs/helix-desktop/tauri', () => {
  it('is the entry for the Tauri bindings', () => {
    expect(HELIX_DESKTOP_TAURI).toBe(true);
  });
});
