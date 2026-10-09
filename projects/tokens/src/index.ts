// The Helix design tokens as data: the input of the token resolver.
// Extracted once from the Helix preset of helix-core (scripts/tokens/extract-preset.mjs); this file is the source now.
import { components } from './components/index.ts';
import { palettes } from './palettes.ts';
import { primitive } from './primitive.ts';
import { semantic } from './semantic.ts';
import type { TokenTree } from './types.ts';

export type { TokenTree };
export { palettes };

/** The preset: primitive, semantic and component layers. */
export const helixTokens = { primitive, semantic, components };
