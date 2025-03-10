import { Dialect, Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST as string,
    dialect: process.env.DB_DIALECT as Dialect,
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

sequelize
  .authenticate()
  .then(() => console.log('Database connected successfully.'))
  .catch((error) => console.error('Database connection failed.', error));

export { sequelize };
