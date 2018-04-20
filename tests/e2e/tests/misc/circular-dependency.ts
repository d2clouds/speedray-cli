import { prependToFile } from '../../utils/fs';
import { sr } from '../../utils/process';


export default async function () {
  await prependToFile('src/app/app.component.ts',
    `import { AppModule } from './app.module'; console.log(AppModule);`);
  let output = await sr('build', '--show-circular-dependencies');
  if (!output.stdout.match(/WARNING in Circular dependency detected/)) {
    throw new Error('Expected to have circular dependency warning in output.');
  }

  await sr('set', 'defaults.build.showCircularDependencies=false');
  output = await sr('build');
  if (output.stdout.match(/WARNING in Circular dependency detected/)) {
    throw new Error('Expected to not have circular dependency warning in output.');
  }
}
