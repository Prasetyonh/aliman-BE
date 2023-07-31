import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2'; // Needed to fix sequelize issues with WebPack


const db = new Sequelize('alimanbo_aliman', 'alimanbo_alimanbo', '@Alimanbo.12345', {
  
  host: 'alimanboga.my.id',
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