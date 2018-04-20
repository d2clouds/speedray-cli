import { sr, killAllProcesses } from '../../utils/process';
import { expectToFail } from '../../utils/utils';
import { ngServe } from '../../utils/project';
import { updateJsonFile } from '../../utils/project';


export default function () {
  return Promise.resolve()
    .then(() => expectToFail(() => sr('e2e', '--no-serve')))
    .then(() => updateJsonFile('.angular-cli.json', configJson => {
      const app = configJson.defaults;
      app.serve = { port: 4400 };
    }))
    .then(() => ngServe())
    .then(() => expectToFail(() => sr('e2e', '--no-serve')))
    .then(() => sr('e2e', '--no-serve', '--base-href=http://localhost:4400'))
    .then(() => sr('e2e', '--no-serve', '--port=4400'))
    .then(() => killAllProcesses(), (err: any) => {
      killAllProcesses();
      throw err;
    });
}
