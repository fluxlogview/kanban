import { closeDatabase, databaseInfo, resetDatabase, DEFAULT_DB_PATH } from './database.mjs';

resetDatabase();
const info = databaseInfo();
console.log(`Banco recriado em ${DEFAULT_DB_PATH}`);
console.log(JSON.stringify(info.counts, null, 2));
closeDatabase();
