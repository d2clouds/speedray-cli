import {readdirSync} from 'fs';
import {oneLine} from 'common-tags';

import {sr, silentNpm} from '../../utils/process';
import {appendToFile, expectFileToExist, prependToFile, replaceInFile} from '../../utils/fs';
import {expectToFail} from '../../utils/utils';


export default function() {
  let oldNumberOfFiles = 0;
  return Promise.resolve()
    .then(() => sr('build'))
    .then(() => oldNumberOfFiles = readdirSync('dist').length)
    .then(() => sr('generate', 'module', 'lazyA', '--routing'))
    .then(() => sr('generate', 'module', 'lazyB', '--routing'))
    .then(() => prependToFile('src/app/app.module.ts', `
      import { RouterModule } from '@angular/router';
    `))
    .then(() => replaceInFile('src/app/app.module.ts', 'imports: [', `imports: [
      RouterModule.forRoot([{ path: "lazyA", loadChildren: "./lazy-a/lazy-a.module#LazyAModule" }]),
      RouterModule.forRoot([{ path: "lazyB", loadChildren: "./lazy-b/lazy-b.module#LazyBModule" }]),
    `))
    .then(() => sr('build'))
    .then(() => readdirSync('dist').length)
    .then(currentNumberOfDistFiles => {
      if (oldNumberOfFiles >= currentNumberOfDistFiles) {
        throw new Error('A bundle for the lazy module was not created.');
      }
      oldNumberOfFiles = currentNumberOfDistFiles;
    })
    .then(() => silentNpm('install', 'moment'))
    .then(() => appendToFile('src/app/lazy-a/lazy-a.module.ts', `
      import * as moment from 'moment';
      console.log(moment);
    `))
    .then(() => sr('build'))
    .then(() => readdirSync('dist').length)
    .then(currentNumberOfDistFiles => {
      if (oldNumberOfFiles != currentNumberOfDistFiles) {
        throw new Error('The build contains a different number of files.');
      }
    })
    .then(() => appendToFile('src/app/lazy-b/lazy-b.module.ts', `
      import * as moment from 'moment';
      console.log(moment);
    `))
    .then(() => sr('build'))
    .then(() => expectFileToExist('dist/common.chunk.js'))
    .then(() => readdirSync('dist').length)
    .then(currentNumberOfDistFiles => {
      if (oldNumberOfFiles >= currentNumberOfDistFiles) {
        throw new Error(oneLine`The build contains the wrong number of files.
          The test for 'dist/common.chunk.js' to exist should have failed.`);
      }
      oldNumberOfFiles = currentNumberOfDistFiles;
    })
    .then(() => sr('build', '--no-common-chunk'))
    .then(() => expectToFail(() => expectFileToExist('dist/common.chunk.js')))
    .then(() => readdirSync('dist').length)
    .then(currentNumberOfDistFiles => {
      if (oldNumberOfFiles <= currentNumberOfDistFiles) {
        throw new Error(oneLine`The build contains the wrong number of files.
          The test for 'dist/common.chunk.js' not to exist should have failed.`);
      }
    })
    // Check for AoT and lazy routes.
    .then(() => sr('build', '--aot'))
    .then(() => readdirSync('dist').length)
    .then(currentNumberOfDistFiles => {
      if (oldNumberOfFiles != currentNumberOfDistFiles) {
        throw new Error('AoT build contains a different number of files.');
      }
    });
}
