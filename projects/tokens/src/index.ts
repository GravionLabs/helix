// The Helix design tokens as data: the input of the token resolver.
// Originally extracted from the Helix preset of the former helix-core; this file is the source now.
import { components } from './components/index.ts';
import { palettes } from './palettes.ts';
import { primitive } from './primitive.ts';
import { semantic } from './semantic.ts';

export type { FontSizeScale, FontSizeStep, SpaceScale, SpaceStep, TokenTree } from './types.ts';
export { palettes };

/** The preset: primitive, semantic and component layers. */
export const helixTokens = { primitive, semantic, components };
