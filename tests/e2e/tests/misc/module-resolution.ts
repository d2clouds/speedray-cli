import { appendToFile, createDir, moveFile, prependToFile } from '../../utils/fs';
import { sr, silentNpm } from '../../utils/process';
import { updateJsonFile } from '../../utils/project';
import { expectToFail } from '../../utils/utils';


export default async function () {
  await updateJsonFile('src/tsconfig.app.json', tsconfig => {
    tsconfig.compilerOptions.paths = {
      '*': [ '../node_modules/*' ],
    };
  });
  await sr('build');

  await createDir('xyz');
  await moveFile(
    'node_modules/@angular/common',
    'xyz/common'
  );

  await expectToFail(() => sr('build'));

  await updateJsonFile('src/tsconfig.app.json', tsconfig => {
    tsconfig.compilerOptions.paths = {
      '@angular/common': [ '../xyz/common' ],
    };
  });
  await sr('build');

  await updateJsonFile('src/tsconfig.app.json', tsconfig => {
    delete tsconfig.compilerOptions.paths;
  });

  await prependToFile('src/app/app.module.ts', 'import * as firebase from \'firebase\';');
  await appendToFile('src/app/app.module.ts', 'firebase.initializeApp({});');

  await silentNpm('install', 'firebase@3.7.8');
  await sr('build', '--aot');
  await sr('test', '--single-run');

  await silentNpm('install', 'firebase@4.9.0');
  await sr('build', '--aot');
  await sr('test', '--single-run');

  await updateJsonFile('src/tsconfig.app.json', tsconfig => {
    tsconfig.compilerOptions.paths = {};
  });
  await sr('build');

  await updateJsonFile('src/tsconfig.app.json', tsconfig => {
    tsconfig.compilerOptions.paths = {
      '@app/*': ['*'],
      '@lib/*/test': ['*/test'],
    };
  });
  await sr('build');

  await updateJsonFile('src/tsconfig.app.json', tsconfig => {
    tsconfig.compilerOptions.paths = {
      '@firebase/polyfill': ['@firebase/polyfill/index.ts'],
    };
  });
  await expectToFail(() => sr('build'));

  await updateJsonFile('src/tsconfig.app.json', tsconfig => {
    tsconfig.compilerOptions.paths = {
      '@firebase/polyfill*': ['@firebase/polyfill/index.ts'],
    };
  });
  await expectToFail(() => sr('build'));
}
