import * as fs from 'fs-extra';
import {join} from 'path';
import {sr} from '../../../utils/process';
import {expectFileToMatch} from '../../../utils/fs';


export default function() {
  const root = process.cwd();
  const modulePath = join(root, 'src/app/admin/module/module.module.ts');

  fs.mkdirSync('./src/app/sub-dir');

  return Promise.resolve()
    .then(() => sr('generate', 'module', 'admin/module'))
    .then(() => sr('generate', 'component', 'other/test-component', '--module', 'admin/module'))
    .then(() => expectFileToMatch(modulePath,
      new RegExp(/import { TestComponentComponent } /.source +
                 /from '..\/..\/other\/test-component\/test-component.component'/.source))

    // Try to run the unit tests.
    .then(() => sr('build'));
}
