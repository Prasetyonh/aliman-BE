import { DataTypes, Sequelize } from 'sequelize';
import db from '../config/database.js';
import { Product } from './productModel.js';
import { User } from './userModels.js';

export const Voucher = db.define(
  'vouchers',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    freezeTableName: true
  }
);

export const VoucherUsage = db.define(
  'voucher_usages',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    voucherId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    usedAt: {
      type: DataTypes.DATE
    }
  },
  {
    freezeTableName: true
  }
);

Voucher.hasMany(VoucherUsage, { foreignKey: 'voucherId' });
VoucherUsage.belongsTo(Voucher, { foreignKey: 'voucherId' });

// Relasi antara User dan VoucherUsage
User.hasMany(VoucherUsage, { foreignKey: 'userId' });
VoucherUsage.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

Product.hasOne(Voucher, { foreignKey: 'productId' });
Voucher.belongsTo(Product, { foreignKey: 'productId' });

// Voucher.hasOne(VoucherUsage, { foreignKey: 'voucherId', as: 'voucherUsage' });
// VoucherUsage.belongsTo(Voucher, { foreignKey: 'voucherId', as: 'voucher' });
