import { Dialect, Sequelize } from 'sequelize';
import * as dbConfig from '../config/config.json';

let sequelize: Sequelize;

try {
  sequelize = new Sequelize(
    dbConfig.development.database,
    dbConfig.development.username,
    dbConfig.development.password,
    {
      host: dbConfig.development.host,
      dialect: dbConfig.development.dialect as Dialect,
      logging: console.log,
      retry: {
        max: 3,
        report: (message, obj, err) => {
          console.error('Database connection could not be established.');
          console.error('DB ERROR: ', message);
          console.error(err);
        },
      },
    },
  );
} catch (error) {
  console.error('Database connection failed.', error);
}

export { sequelize };
