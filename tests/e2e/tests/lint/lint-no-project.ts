import { sr } from '../../utils/process';
import { writeFile } from '../../utils/fs';
import { expectToFail } from '../../utils/utils';
import { oneLine } from 'common-tags';

export default function () {
  return Promise.resolve()
    .then(() => sr('set', 'lint.0.project', ''))
    .then(() => sr('lint', '--type-check'))
    .then(({ stdout }) => {
      if (!stdout.match(/A "project" must be specified to enable type checking./)) {
        throw new Error(oneLine`
          Expected to match "A "project" must be specified to enable type checking."
          in ${stdout}.
        `);
      }

      return stdout;
    })
    .then(() => sr('set', 'lint.0.files', '"**/baz.ts"'))
    .then(() => writeFile('src/app/foo.ts', 'const foo = "";\n'))
    .then(() => writeFile('src/app/baz.ts', 'const baz = \'\';\n'))
    .then(() => sr('lint'))
    .then(() => sr('set', 'lint.0.files', '"**/foo.ts"'))
    .then(() => expectToFail(() => sr('lint')));
}
