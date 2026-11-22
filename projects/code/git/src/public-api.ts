/** Version of `@gravionlabs/helix-code/git`. */
export const HELIX_CODE_GIT_VERSION = '0.1.0';

export {
  HxChangedFileActions,
  HxChangedFiles,
  type HxChangedFile,
  type HxChangeStatus,
} from './changed-files/changed-files';

export {
  hxLayoutCommits,
  HX_GRAPH_COLORS,
  type HxCommit,
  type HxCommitRef,
  type HxGraphRow,
  type HxGraphSegment,
  type HxLayoutState,
  type HxOpenLane,
} from './commit-layout';
