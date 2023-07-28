import { DataTypes, Sequelize } from 'sequelize';
import db from '../config/database.js';
import { User } from './userModels.js';
import { Product } from './productModel.js';
import { Voucher } from './voucherModel.js';

export const Order = db.define(
  'orders',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.STRING,
      unique: true
    },
    userId: {
      type: DataTypes.UUID
    },
    productId: {
      type: DataTypes.UUID
    },
    banyak: {
      type: DataTypes.INTEGER
    },
    total_harga: {
      type: DataTypes.FLOAT
    },
    total_bayar: {
      type: DataTypes.FLOAT
    },
    status: {
      type: DataTypes.STRING
    },
    tanggal_pesan: {
      type: DataTypes.DATE
    },
    tanggal_ambil: {
      type: DataTypes.DATEONLY
    },
    jam_ambil: {
      type: DataTypes.TIME
    },
    catatan: {
      type: DataTypes.STRING(500)
    },
    voucherId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    usedVoucher: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    freezeTableName: true
  }
);

Order.belongsTo(Voucher, { foreignKey: 'voucherId' });

Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });

Order.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Order, { foreignKey: 'productId' });
