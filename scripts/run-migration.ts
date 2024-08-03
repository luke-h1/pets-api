/* eslint-disable no-console */
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const dataSourcePath = './src/db/app-data-source.ts';

async function runMigrations(): Promise<void> {
  try {
    const { stdout, stderr } = await execAsync(
      `pnpm typeorm migration:run -d ${dataSourcePath}`,
    );

    console.log(stdout);
    if (stderr) {
      console.error('Error:', stderr);
    }
  } catch (error) {
    console.error('Failed to run migrations:', error);
  }
}

runMigrations();
