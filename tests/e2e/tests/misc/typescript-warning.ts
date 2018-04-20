import { sr, silentNpm } from '../../utils/process';
import { getGlobalVariable } from '../../utils/env';


export default function () {
  // typescript@2.7.0-dev.20180104 is not part of the officially supported range in latest stable.
  let unsupportedTsVersion = '2.7.0-dev.20180104';

  // Skip this test in Angular 2/4.
  if (getGlobalVariable('argv').ng2 || getGlobalVariable('argv').ng4) {
    return Promise.resolve();
  }

  return Promise.resolve()
    // Warning should show.
    .then(() => silentNpm('install', `typescript@${unsupportedTsVersion}`, '--no-save'))
    .then(() => sr('build'))
    .then((output) => {
      if (!output.stdout.match('Using this version can result in undefined behaviour')) {
        throw new Error('Expected to have typescript version mismatch warning in output.');
      }
    })
    // Warning should be disabled with global flag.
    .then(() => sr('set', '--global', 'warnings.typescriptMismatch=false'))
    .then(() => sr('build'))
    .then((output) => {
      if (output.stdout.match('Using this version can result in undefined behaviour')) {
        throw new Error('Expected to not have typescript version mismatch warning in output.');
      }
    })
    .then(() => sr('set', '--global', 'warnings.typescriptMismatch=true'))
    // Warning should be disabled with local flag.
    .then(() => sr('set', 'warnings.typescriptMismatch=false'))
    .then(() => sr('build'))
    .then((output) => {
      if (output.stdout.match('Using this version can result in undefined behaviour')) {
        throw new Error('Expected to not have typescript version mismatch warning in output.');
      }
    })
    .then(() => sr('set', 'warnings.typescriptMismatch=true'))
    // Cleanup
    .then(() => silentNpm('install'));
}

