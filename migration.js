import fs from 'fs';
import Database from './server/model/Database';

module.exports.default = () => {
  console.log('I am EmmsDan Migrate Script');
};
/**
 * init
 */
module.exports.init = () => {
  const sql = fs.readFileSync('./migration.sql').toString();
  Database.rawSql(sql)
    .then((res) => {
      console.log('migrated', res[0].command);
    })
    .catch((error) => {
      console.log(error.message);
    });
};
require('make-runnable');
