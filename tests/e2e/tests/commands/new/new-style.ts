import {sr} from '../../../utils/process';
import {createProject} from '../../../utils/project';
import {expectFileToExist} from '../../../utils/fs';


export default function() {
  return Promise.resolve()
    .then(() => sr('set', 'defaults.styleExt', 'scss', '--global'))
    .then(() => createProject('style-project'))
    .then(() => expectFileToExist('src/app/app.component.scss'))

    // Try to run the unit tests.
    .then(() => sr('test', '--single-run'));
}
