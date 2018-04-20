import * as fs from 'fs-extra';
import {join} from 'path';
import {sr} from '../../../utils/process';
import {expectFileToMatch} from '../../../utils/fs';


export default function() {
  const root = process.cwd();
  const modulePath = join(root, 'src', 'app', 'app.module.ts');

  fs.mkdirSync('./src/app/sub-dir');

  return sr('generate', 'component', 'test-component', '--module', 'app.module.ts')
    .then(() => expectFileToMatch(modulePath,
      /import { TestComponentComponent } from '.\/test-component\/test-component.component'/))

    .then(() => process.chdir(join(root, 'src', 'app')))
    .then(() => sr('generate', 'component', 'test-component2', '--module', 'app.module.ts'))
    .then(() => expectFileToMatch(modulePath,
      /import { TestComponent2Component } from '.\/test-component2\/test-component2.component'/))

    // Try to run the unit tests.
    .then(() => sr('build'));
}
