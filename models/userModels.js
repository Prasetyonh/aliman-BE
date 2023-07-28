import { DataTypes, Sequelize } from 'sequelize';
import db from '../config/database.js';
import { Product } from './productModel.js';

export const User = db.define(
  'user',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    no_kk: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.STRING
    },
    kontak: {
      type: DataTypes.STRING
    },
    alamat: {
      type: DataTypes.STRING
    },
    refreshToken: {
      type: DataTypes.STRING(500)
    }
  },
  {
    freezeTableName: true
  }
);

User.hasMany(Product, {
  foreignKey: 'pelapakId',
  as: 'products',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Product.belongsTo(User, {
  foreignKey: 'pelapakId',
  as: 'user',
  targetKey: 'id'
});
