import {
  sr,
  npm,
  execAndWaitForOutputToMatch,
  killAllProcesses
} from '../../utils/process';
import {updateJsonFile} from '../../utils/project';
import {expectToFail} from '../../utils/utils';
import {moveFile, copyFile, replaceInFile} from '../../utils/fs';


export default function () {
  // Should fail without updated webdriver
  return updateJsonFile('package.json', packageJson => {
    // Add to npm scripts to make running the binary compatible with Windows
    const scripts = packageJson['scripts'];
    scripts['wd:clean'] = 'webdriver-manager clean';
  })
    .then(() => npm('run', 'wd:clean'))
    .then(() => expectToFail(() => sr('e2e', '--no-webdriver-update', '--no-serve')))
    // Should fail without serving
    .then(() => expectToFail(() => sr('e2e', '--no-serve')))
    // These should work.
    .then(() => sr('e2e'))
    .then(() => sr('e2e', '--prod'))
    // Should use port in baseUrl
    .then(() => sr('e2e', '--port', '4400'))
    // Should accept different config file
    .then(() => moveFile('./protractor.conf.js', './renamed-protractor.conf.js'))
    .then(() => sr('e2e', '--config', './renamed-protractor.conf.js'))
    .then(() => moveFile('./renamed-protractor.conf.js', './protractor.conf.js'))
    // Should accept different multiple spec files
    .then(() => moveFile('./e2e/app.e2e-spec.ts', './e2e/renamed-app.e2e-spec.ts'))
    .then(() => copyFile('./e2e/renamed-app.e2e-spec.ts', './e2e/another-app.e2e-spec.ts'))
    .then(() => sr('e2e', '--specs', './e2e/renamed-app.e2e-spec.ts',
      '--specs', './e2e/another-app.e2e-spec.ts'))
    // Suites block need to be added in the protractor.conf.js file to test suites
    .then(() => replaceInFile('protractor.conf.js', `allScriptsTimeout: 11000,`,
      `allScriptsTimeout: 11000,
          suites: {
            app: './e2e/app.e2e-spec.ts'
          },
    `))
    .then(() => sr('e2e', '--suite=app'))
    // remove suites block from protractor.conf.js file after testing suites
    .then(() => replaceInFile('protractor.conf.js', `allScriptsTimeout: 11000,
          suites: {
            app: './e2e/app.e2e-spec.ts'
          },
    `, `allScriptsTimeout: 11000,`
    ))
    // Should start up Element Explorer
    .then(() => execAndWaitForOutputToMatch('sr', ['e2e', '--element-explorer'],
      /Element Explorer/))
    .then(() => killAllProcesses(), (err: any) => {
      killAllProcesses();
      throw err;
    })
    // Should run side-by-side with `sr serve`
    .then(() => execAndWaitForOutputToMatch('sr', ['serve'],
      /webpack: Compiled successfully./))
    .then(() => sr('e2e'))
    .then(() => killAllProcesses(), (err: any) => {
      killAllProcesses();
      throw err;
    });
}
