/* eslint-disable no-console */
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const defaultMigrationPath = './src/db/migrations';
const dataSourcePath = './src/db/app-data-source.ts';

async function createMigration(migrationName: string): Promise<void> {
  const migrationFullPath = `${defaultMigrationPath}/${migrationName}`;

  try {
    const { stdout, stderr } = await execAsync(
      `pnpm typeorm migration:generate ${migrationFullPath} -d ${dataSourcePath}`,
    );

    console.log(stdout);
    if (stderr) {
      console.error('Error:', stderr);
    }
  } catch (error) {
    console.error('Failed to create migration:', error);
  }
}

const migrationName = process.argv[2];
console.log('name', migrationName);

if (!migrationName) {
  console.error('Please provide a name for the migration.');
  process.exit(1);
}

createMigration(migrationName);
