/* eslint-disable no-console */
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const dataSourcePath = './src/db/app-data-source.ts';

async function dropDatabase(): Promise<void> {
  try {
    const { stdout, stderr } = await execAsync(
      `pnpm typeorm schema:drop -d ${dataSourcePath}`,
    );

    console.log(stdout);
    if (stderr) {
      console.error('Error:', stderr);
    }
  } catch (error) {
    console.error('Failed to drop database:', error);
  }
}

dropDatabase();
