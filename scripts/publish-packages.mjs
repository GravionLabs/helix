// Publishes the library packages to npm, skipping those whose version is already there (#1107).
// A partly published release (a failed run, a package published by hand) can then be re-run to completion;
// any other npm error still fails. Usage: node scripts/publish-packages.mjs <version> <dir>...
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/** Runs a command and returns `{ status, stdout, stderr }`. */
function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: 'utf8' });
  return { status: r.status ?? 1, stdout: r.stdout ?? '', stderr: r.stderr ?? '' };
}

/**
 * Whether `name@version` is on the registry. `npm view` fails with E404 for an unknown package or version
 * (both mean "not published"); any other failure (network, auth) throws so that it is not mistaken for "absent".
 */
export function isPublished(name, version, exec = run) {
  const r = exec('npm', ['view', `${name}@${version}`, 'version']);
  if (r.status === 0) return r.stdout.trim() === version;
  if (/E404|404 Not Found/.test(`${r.stderr}${r.stdout}`)) return false;
  throw new Error(`npm view ${name}@${version} failed: ${r.stderr || r.stdout}`);
}

/** Publishes each dir unless its version is already on npm. Returns `{ published, skipped }` (package names). */
export function publishPackages(dirs, version, { exec = run, readName = defaultReadName, log = console.log } = {}) {
  const published = [];
  const skipped = [];
  for (const dir of dirs) {
    const name = readName(dir);
    if (isPublished(name, version, exec)) {
      log(`skip ${name}@${version}: already on npm`);
      skipped.push(name);
      continue;
    }
    // The leading ./ keeps npm from reading the name as a "user/repo" git shorthand.
    const r = exec('npm', ['publish', `./${dir}`, '--access', 'public', '--provenance']);
    if (r.status !== 0) throw new Error(`npm publish ${name}@${version} failed: ${r.stderr || r.stdout}`);
    log(`published ${name}@${version}`);
    published.push(name);
  }
  return { published, skipped };
}

function defaultReadName(dir) {
  return JSON.parse(readFileSync(`./${dir}/package.json`, 'utf8')).name;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const [version, ...dirs] = process.argv.slice(2);
  if (!version || dirs.length === 0) {
    console.error('usage: publish-packages.mjs <version> <dir>...');
    process.exit(2);
  }
  try {
    publishPackages(dirs, version);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
