import { DataTypes, Sequelize } from 'sequelize';
import db from '../config/database.js';

export const Product = db.define(
  'products',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    },
    harga: {
      type: DataTypes.STRING
    },
    stock: {
      type: DataTypes.INTEGER
    },
    deskripsi: {
      type: DataTypes.STRING
    },
    pelapakId: {
      type: DataTypes.UUID
    },
    visibility: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    freezeTableName: true
  }
);

export const Image = db.define(
  'images',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    filename: {
      type: DataTypes.STRING
    },
    data: {
      type: DataTypes.BLOB('long'), // Use BLOB type to store binary data
      allowNull: false
    },
    url: {
      type: DataTypes.STRING
    },
    productId: {
      type: DataTypes.UUID,
      references: {
        model: Product,
        key: 'id'
      }
    }
  },
  {
    freezeTableName: true
  }
);

Product.hasMany(Image, { foreignKey: 'productId' });
Image.belongsTo(Product, { foreignKey: 'productId' });
