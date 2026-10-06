/** Where each piece is built, relative to the top folder of the repository. */
export declare const PIECES: { site: string; demo: string };

/** Copies the built pieces from `repo` into `out`; throws, naming the piece, when one is missing. */
export declare function assemble(repo: string, out: string): string;
