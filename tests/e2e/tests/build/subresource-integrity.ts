import { expectFileToMatch } from '../../utils/fs';
import { sr } from '../../utils/process';
import { expectToFail } from '../../utils/utils';

const integrityRe = /integrity="\w+-[A-Za-z0-9\/\+=]+"/;

export default async function() {
  return sr('build')
    .then(() => expectToFail(() =>
      expectFileToMatch('dist/index.html', integrityRe)))
    .then(() => sr('build', '--sri'))
    .then(() => expectFileToMatch('dist/index.html', integrityRe));
}
