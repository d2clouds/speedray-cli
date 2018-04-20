import * as fs from 'fs';
import * as semver from 'semver';


export function readSrVersion(): string {
  const packageJson: any = JSON.parse(fs.readFileSync('./node_modules/@speedray/core/package.json', 'utf8'));
  return packageJson['version'];
}

export function ngVersionMatches(range: string): boolean {
  return semver.satisfies(readSrVersion(), range);
}
