import fs from 'fs';
import Database from './server/model/Database';

module.exports.default = () => {
  console.log('I am EmmsDan Migrate Script');
};

/**
 * init
 * @returns promise
 */
module.exports.init = () => {
  const sql = fs.readFileSync('./migration.sql').toString();
  return Database.rawSql(sql)
    .then((res) => {
      const r = { res, state: 'updated' };
      console.log('migrated', r.state);
    })
    .catch((error) => {
      console.log(error);
    });
};
require('make-runnable');
