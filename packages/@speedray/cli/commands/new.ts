import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

import { CliConfig } from '@angular/cli/models/config';
import { validateProjectName } from '@angular/cli/utilities/validate-project-name';
import { oneLine } from 'common-tags';
import { SchematicAvailableOptions } from '@angular/cli/tasks/schematic-get-options';

const { cyan } = chalk;

const Command = require('../ember-cli/lib/models/command');
const SilentError = require('silent-error');

const NewCommand = Command.extend({
  name: 'new',
  aliases: ['n'],
  description: `Creates a new directory and a new Angular app eg. "sr new [name]".`,
  works: 'outsideProject',

  availableOptions: [
    {
      name: 'dry-run',
      type: Boolean,
      default: false,
      aliases: ['d'],
      description: oneLine`
        Run through without making any changes.
        Will list all files that would have been created when running "sr new".
      `
    },
    {
      name: 'verbose',
      type: Boolean,
      default: false,
      aliases: ['v'],
      description: 'Adds more details to output logging.'
    },
    {
      name: 'collection',
      type: String,
      aliases: ['c'],
      description: 'Schematics collection to use.'
    }
  ],

  isProject: function (projectPath: string) {
    return CliConfig.fromProject(projectPath) !== null;
  },

  getCollectionName(rawArgs: string[]) {
    let collectionName = CliConfig.fromGlobal().get('defaults.schematics.collection');
    if (rawArgs) {
      const parsedArgs = this.parseArgs(rawArgs, false);
      if (parsedArgs.options.collection) {
        collectionName = parsedArgs.options.collection;
      }
    }
    return collectionName;
  },

  beforeRun: function (rawArgs: string[]) {
    const isHelp = ['--help', '-h'].includes(rawArgs[0]);
    if (isHelp) {
      return;
    }

    const schematicName = CliConfig.getValue('defaults.schematics.newApp');

    if (/^\d/.test(rawArgs[1])) {
      SilentError.debugOrThrow('@speedray/cli/commands/generate',
        `The \`sr new ${rawArgs[0]}\` file name cannot begin with a digit.`);
    }

    const SchematicGetOptionsTask = require('@angular/cli/tasks/schematic-get-options').default;

    const getOptionsTask = new SchematicGetOptionsTask({
      ui: this.ui,
      project: this.project
    });

    return getOptionsTask.run({
      schematicName,
      collectionName: this.getCollectionName(rawArgs)
    })
      .then((availableOptions: SchematicAvailableOptions) => {
        this.registerOptions({
          availableOptions: availableOptions
        });
      });
  },

  run: function (commandOptions: any, rawArgs: string[]) {
    const packageName = rawArgs.shift();

    if (!packageName) {
      return Promise.reject(new SilentError(
        `The "sr ${this.name}" command requires a name argument to be specified eg. ` +
        chalk.yellow('sr new [name] ') +
        `For more details, use "sr help".`));
    }

    validateProjectName(packageName);
    commandOptions.name = packageName;
    if (commandOptions.dryRun) {
      commandOptions.skipGit = true;
    }

    commandOptions.directory = commandOptions.directory || packageName;
    const directoryName = path.join(process.cwd(), commandOptions.directory);

    if (fs.existsSync(directoryName) && this.isProject(directoryName)) {
      throw new SilentError(oneLine`
        Directory ${directoryName} exists and is already an Speedray CLI project.
      `);
    }

    if (commandOptions.collection) {
      commandOptions.collectionName = commandOptions.collection;
    } else {
      commandOptions.collectionName = this.getCollectionName(rawArgs);
    }

    const InitTask = require('@angular/cli/tasks/init').default;

    const initTask = new InitTask({
      project: this.project,
      tasks: this.tasks,
      ui: this.ui,
    });

    // Ensure skipGit has a boolean value.
    commandOptions.skipGit = commandOptions.skipGit === undefined ? false : commandOptions.skipGit;

    return initTask.run(commandOptions, rawArgs);
  },

  printDetailedHelp: function (): string | Promise<string> {
    const collectionName = this.getCollectionName();
    const schematicName = CliConfig.getValue('defaults.schematics.newApp');
    const SchematicGetHelpOutputTask =
      require('@angular/cli/tasks/schematic-get-help-output').default;
    const getHelpOutputTask = new SchematicGetHelpOutputTask({
      ui: this.ui,
      project: this.project
    });
    return getHelpOutputTask.run({
      schematicName,
      collectionName,
      nonSchematicOptions: this.availableOptions.filter((o: any) => !o.hidden)
    })
    .then((output: string[]) => {
      const outputLines = [
        cyan(`sr new ${cyan('[name]')} ${cyan('<options...>')}`),
        ...output
      ];
      return outputLines.join('\n');
    });
  }
});


NewCommand.overrideCore = true;
export default NewCommand;
