import * as fs from 'fs-extra';
import {join} from 'path';
import {sr} from '../../../utils/process';
import {expectFileToMatch} from '../../../utils/fs';


export default function() {
  const root = process.cwd();
  const modulePath = join(root, 'src', 'app', 'app.module.ts');

  fs.mkdirSync('./src/app/sub-dir');

  return sr('generate', 'service', 'test-service', '--module', 'app.module.ts')
    .then(() => expectFileToMatch(modulePath,
      /import { TestServiceService } from '.\/test-service.service'/))

    .then(() => process.chdir(join(root, 'src', 'app')))
    .then(() => sr('generate', 'service', 'test-service2', '--module', 'app.module.ts'))
    .then(() => expectFileToMatch(modulePath,
      /import { TestService2Service } from '.\/test-service2.service'/))

    // Try to run the unit tests.
    .then(() => sr('build'));
}
