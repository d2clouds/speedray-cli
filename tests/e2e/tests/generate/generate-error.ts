import {sr} from '../../utils/process';
import {deleteFile} from '../../utils/fs';
import {expectToFail} from '../../utils/utils';

export default function() {
  return deleteFile('.angular-cli.json')
    .then(() => expectToFail(() => sr('generate', 'class', 'hello')));
}
