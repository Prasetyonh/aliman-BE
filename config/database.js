import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2'; // Needed to fix sequelize issues with WebPack


const db = new Sequelize('bcxfg7iydd7d8edy26ca', 'ux0o1eposvsql6ky', '0u4U4g4ULbHHp21cr8WQ', {
  
  host: 'bcxfg7iydd7d8edy26ca-mysql.services.clever-cloud.com',
  dialect: 'mysql',
  dialectModule: mysql2, // Needed to fix sequelize issues with WebPack
  
});
export async function connectToDatabase() {
  console.log('Trying to connect via sequelize')
  await db.sync()
  await db.authenticate()
  console.log('=> Created a new connection.')

  // Do something 
}

export default db;