import { AppModule } from '../../assets/1.0.0-proj/src/app/app.module';
import { readFile, writeFile } from '../../utils/fs';
import { sr } from '../../utils/process';


export default async function() {
  const mainTs = await readFile('src/main.ts');

  const newMainTs = mainTs
    .replace(/platformBrowserDynamic.*?bootstrapModule.*?;/, '')
    + 'console.log(AppModule);';  // Use AppModule to make sure it's imported properly.

  await writeFile('src/main.ts', newMainTs);
  await sr('build');
}
