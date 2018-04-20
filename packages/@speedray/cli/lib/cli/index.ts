// TODO: remove this commented AJV require.
// We don't actually require AJV, but there is a bug with NPM and peer dependencies that is
// whose workaround is to depend on AJV.
// See https://github.com/angular/angular-cli/issues/9691#issuecomment-367322703 for details.
// We need to add a require here to satisfy the dependency checker.
// require('ajv');

import * as path from 'path';

const cli = require('../../ember-cli/lib/cli');
const UI = require('../../ember-cli/lib/ui');


function loadCommands() {
  return {
    'build': require('@angular/cli/commands/build').default,
    'serve': require('@angular/cli/commands/serve').default,
    'eject': require('@angular/cli/commands/eject').default,
    'new': require('@angular/cli/commands/new').default,
    'generate': require('../../commands/generate').default,
    'destroy': require('@angular/cli/commands/destroy').default,
    'test': require('@angular/cli/commands/test').default,
    'e2e': require('@angular/cli/commands/e2e').default,
    'help': require('@angular/cli/commands/help').default,
    'lint': require('@angular/cli/commands/lint').default,
    'version': require('@angular/cli/commands/version').default,
    'completion': require('@angular/cli/commands/completion').default,
    'doc': require('@angular/cli/commands/doc').default,
    'xi18n': require('@angular/cli/commands/xi18n').default,
    'update': require('@angular/cli/commands/update').default,

    // Easter eggs.
    'make-this-awesome': require('@angular/cli/commands/easter-egg').default,

    // Configuration.
    'set': require('@angular/cli/commands/set').default,
    'get': require('@angular/cli/commands/get').default
  };
}

export default function(options: any) {

  // patch UI to not print Ember-CLI warnings (which don't apply to Angular CLI)
  UI.prototype.writeWarnLine = function () { };

  options.cli = {
    name: 'ng',
    root: path.join(__dirname, '..', '..'),
    npmPackage: '@speedray/cli'
  };

  options.commands = loadCommands();

  // ensure the environemnt variable for dynamic paths
  process.env.PWD = path.normalize(process.env.PWD || process.cwd());
  process.env.CLI_ROOT = process.env.CLI_ROOT || path.resolve(__dirname, '..', '..');

  return cli(options);
}
