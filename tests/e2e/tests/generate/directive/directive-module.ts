import * as fs from 'fs-extra';
import {join} from 'path';
import {sr} from '../../../utils/process';
import {expectFileToMatch} from '../../../utils/fs';


export default function() {
  const root = process.cwd();
  const modulePath = join(root, 'src', 'app', 'app.module.ts');

  fs.mkdirSync('./src/app/sub-dir');

  return sr('generate', 'directive', 'test-directive', '--module', 'app.module.ts')
    .then(() => expectFileToMatch(modulePath,
      /import { TestDirectiveDirective } from '.\/test-directive.directive'/))

    .then(() => process.chdir(join(root, 'src', 'app')))
    .then(() => sr('generate', 'directive', 'test-directive2', '--module', 'app.module.ts'))
    .then(() => expectFileToMatch(modulePath,
      /import { TestDirective2Directive } from '.\/test-directive2.directive'/))

    // Try to run the unit tests.
    .then(() => sr('build'));
}
