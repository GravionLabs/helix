/** Number of line colors; matches `--hx-graph-lane-1` to `--hx-graph-lane-8`. */
export const HX_GRAPH_COLORS = 8;

export interface HxCommitRef {
  name: string;
  kind: 'branch' | 'remote' | 'tag' | 'head';
}

export interface HxCommit {
  id: string;
  /** All parents; the first one is the main line. */
  parents: string[];
  message: string;
  author: string;
  /** Unix seconds. */
  time: number;
  refs?: HxCommitRef[];
}

export interface HxGraphSegment {
  /** Lane at the top edge of the row. */
  fromLane: number;
  /** Lane at the bottom edge of the row. */
  toLane: number;
  /** Palette index 0 to 7. */
  color: number;
  kind: 'pass-through' | 'branch-out' | 'merge-in';
}

export interface HxGraphRow {
  lane: number;
  /** Palette index of the line the commit sits on. */
  color: number;
  /**
   * True when a line enters the commit dot from the top edge (a lane expected
   * this commit). False for a branch tip.
   */
  hasIncoming: boolean;
  segments: HxGraphSegment[];
}

export interface HxOpenLane {
  /** Id of the commit this lane expects next. */
  id: string;
  color: number;
}

export interface HxLayoutState {
  /** Per lane: the open line, or `null` when the lane is free. */
  lanes: (HxOpenLane | null)[];
  /** Next value of the color counter (not reduced). */
  nextColor: number;
}

function lowestFree(lanes: (HxOpenLane | null)[]): number {
  const free = lanes.indexOf(null);
  return free === -1 ? lanes.length : free;
}

/**
 * Lays out commits for a graph. Input order is kept: a commit comes before its
 * parents. Pass the `state` of an earlier call as `previous` to continue a
 * layout page by page.
 */
export function hxLayoutCommits(
  commits: readonly HxCommit[],
  previous?: HxLayoutState,
): { rows: HxGraphRow[]; state: HxLayoutState } {
  const lanes: (HxOpenLane | null)[] = previous ? [...previous.lanes] : [];
  let nextColor = previous?.nextColor ?? 0;
  const rows: HxGraphRow[] = [];

  for (const commit of commits) {
    const expecting: number[] = [];
    for (let i = 0; i < lanes.length; i++) {
      if (lanes[i]?.id === commit.id) expecting.push(i);
    }

    let lane: number;
    let color: number;
    const hasIncoming = expecting.length > 0;
    if (hasIncoming) {
      lane = expecting[0];
      color = lanes[lane]!.color;
    } else {
      lane = lowestFree(lanes);
      color = nextColor++ % HX_GRAPH_COLORS;
    }

    const segments: HxGraphSegment[] = [];
    const merged = new Set(expecting.slice(1));
    const [firstParent, ...otherParents] = commit.parents;

    // Lines that end here or pass by, in lane order.
    for (let i = 0; i < lanes.length; i++) {
      const open = lanes[i];
      if (!open) continue;
      if (merged.has(i)) {
        segments.push({ fromLane: i, toLane: lane, color: open.color, kind: 'merge-in' });
        lanes[i] = null;
      } else if (i !== lane) {
        segments.push({ fromLane: i, toLane: i, color: open.color, kind: 'pass-through' });
      }
    }

    // The commit's own line: the first parent continues in its lane.
    if (firstParent !== undefined) {
      lanes[lane] = { id: firstParent, color };
      segments.push({ fromLane: lane, toLane: lane, color, kind: 'pass-through' });
    } else {
      lanes[lane] = null;
    }

    for (const parent of otherParents) {
      const existing = lanes.findIndex((l) => l?.id === parent);
      if (existing !== -1) {
        segments.push({
          fromLane: lane,
          toLane: existing,
          color: lanes[existing]!.color,
          kind: 'branch-out',
        });
      } else {
        const target = lowestFree(lanes);
        const parentColor = nextColor++ % HX_GRAPH_COLORS;
        lanes[target] = { id: parent, color: parentColor };
        segments.push({ fromLane: lane, toLane: target, color: parentColor, kind: 'branch-out' });
      }
    }

    rows.push({ lane, color, hasIncoming, segments });
  }

  while (lanes.length > 0 && lanes[lanes.length - 1] === null) lanes.pop();
  return { rows, state: { lanes, nextColor } };
}
