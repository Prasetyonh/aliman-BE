import { Sequelize } from 'sequelize';

const db = new Sequelize('al_iman_boga', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

export default db;
