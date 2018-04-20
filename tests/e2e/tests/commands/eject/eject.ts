import * as path from 'path';
import { expectFileToMatch, readFile } from '../../../utils/fs';

import {sr, silentNpm, exec} from '../../../utils/process';
import {expectToFail} from '../../../utils/utils';
import {expectGitToBeClean} from '../../../utils/git';


export default function() {
  return sr('eject')
    .then(() => expectToFail(() => sr('build')))
    .then(() => expectToFail(() => sr('test')))
    .then(() => expectToFail(() => sr('e2e')))
    .then(() => expectToFail(() => sr('serve')))
    .then(() => expectToFail(() => expectGitToBeClean()))

    // Check that no path appears anymore.
    .then(() => expectToFail(() => expectFileToMatch('webpack.config.js', process.cwd())))

    .then(() => silentNpm('install'))
    .then(() => exec(path.join('node_modules', '.bin', 'webpack')));
}
