import {sr} from '../../../utils/process';
import {updateJsonFile} from '../../../utils/project';
import {expectToFail} from '../../../utils/utils';

export default function() {
  return Promise.resolve()
    .then(() => updateJsonFile('.angular-cli.json', configJson => {
      const app = configJson['apps'][0];
      app['outDir'] = './';
    }))
    .then(() => expectToFail(() => sr('build')))
    .then(() => expectToFail(() => sr('serve')))
    .then(() => expectToFail(() => sr('eject')));
}



