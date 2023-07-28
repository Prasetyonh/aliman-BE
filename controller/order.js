import { Order } from '../models/orderModel.js';
import { Image, Product } from '../models/productModel.js';
import { User } from '../models/userModels.js';
import { Voucher, VoucherUsage } from '../models/voucherModel.js';

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId, {
      include: [
        { model: User, as: 'user', attributes: ['name', 'alamat', 'kontak'] },
        {
          model: Product,
          as: 'product',
          include: [
            { model: Image, as: 'images' },
            { model: Voucher, as: 'voucher', attributes: ['jumlah', 'name'] }
          ]
        }
      ]
    });
    if (!order) {
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    }
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error.message });
  }
};
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ['name', 'email'] },
        { model: Product, as: 'product', attributes: ['name', 'harga'] },
        { model: Voucher, as: 'voucher', attributes: ['jumlah', 'name'] }
      ]
    });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.findAll({
      where: {
        userId: userId
      },
      include: [
        { model: User, attributes: ['name', 'email'] },
        { model: Product, as: 'product', attributes: ['name', 'harga'] },
        { model: Voucher, as: 'voucher', attributes: ['jumlah', 'name'] }
      ]
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    }

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error.message });
  }
};

// export const createOrder = async (req, res) => {
//   try {
//     const { userId, productId, banyak, status, tanggal_ambil, jam_ambil, voucherId, catatan } =
//       req.body;

//     const product = await Product.findByPk(productId);

//     if (!product) {
//       return res.status(404).json({ errorMessage: 'Produk tidak ditemukan' });
//     }

//     if (product.stock < banyak) {
//       return res.status(400).json({ errorMessage: 'Stok produk tidak mencukupi' });
//     }

//     product.stock -= banyak;
//     await product.save();

//     let total_harga = product.harga * banyak;
//     let total_bayar = total_harga; // Menggunakan total harga sebagai total bayar awal

//     let voucher = null;
//     if (voucherId) {
//       voucher = await Voucher.findByPk(voucherId);

//       if (!voucher) {
//         return res.status(404).json({ errorMessage: 'Voucher tidak ditemukan' });
//       }

//       if (voucher.isUsed) {
//         return res.status(400).json({ errorMessage: 'Voucher Sudah Digunakan' });
//       }

//       // Mengurangi nilai voucher dari total bayar
//       total_bayar -= voucher.jumlah;

//       // Jika total bayar negatif, maka ubah menjadi 0
//       if (total_bayar < 0) {
//         total_bayar = 0;
//       }
//       voucher.isUsed = true;
//       voucher.usedAt = new Date();
//       await voucher.save();
//     }
//     const orderCount = await Order.count(); // Menghitung jumlah order yang sudah ada
//     const orderId = `ORD${orderCount + 1}`; // Membuat orderId dengan format "ORD" + nomor urut

//     const order = await Order.create({
//       orderId,
//       userId,
//       productId,
//       banyak,
//       total_harga,
//       total_bayar,
//       status,
//       tanggal_pesan: new Date(),
//       tanggal_ambil,
//       jam_ambil,
//       catatan,
//       voucherId: voucher ? voucher.id : null,
//       usedVoucher: !!voucherId
//     });

//     res.status(201).json({ message: 'Order berhasil dibuat', order });
//     console.log('banyak', banyak);
//     console.log('banyak', product);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ errorMessage: error.message });
//   }
// };

// export const createOrder = async (req, res) => {
//   try {
//     const { userId, productId, banyak, status, tanggal_ambil, jam_ambil, voucherId, catatan } =
//       req.body;

//     const product = await Product.findByPk(productId);

//     if (!product) {
//       return res.status(404).json({ errorMessage: 'Produk tidak ditemukan' });
//     }

//     if (product.stock < banyak) {
//       return res.status(400).json({ errorMessage: 'Stok produk tidak mencukupi' });
//     }

//     product.stock -= banyak;
//     await product.save();

//     let total_harga = product.harga * banyak;
//     let total_bayar = total_harga;

//     let voucher = null;
//     if (voucherId) {
//       voucher = await Voucher.findByPk(voucherId);

//       if (!voucher) {
//         return res.status(404).json({ errorMessage: 'Voucher tidak ditemukan' });
//       }

//       const voucherUsage = await VoucherUsage.findOne({ where: { voucherId, userId } });

//       if (!voucherUsage) {
//         return res.status(400).json({ errorMessage: 'Voucher tidak digunakan oleh pengguna ini' });
//       }

//       if (voucherUsage.isUsed) {
//         return res.status(400).json({ errorMessage: 'Voucher Sudah Digunakan' });
//       }

//       // Mengurangi nilai voucher dari total bayar
//       total_bayar -= voucher.jumlah;

//       // Jika total bayar negatif, maka ubah menjadi 0
//       if (total_bayar < 0) {
//         total_bayar = 0;
//       }

//       voucherUsage.isUsed = true;
//       voucherUsage.usedAt = new Date();
//       await voucherUsage.save();
//     }

//     const orderCount = await Order.count(); // Menghitung jumlah order yang sudah ada
//     const orderId = `ORD${orderCount + 1}`; // Membuat orderId dengan format "ORD" + nomor urut

//     const order = await Order.create({
//       orderId,
//       userId,
//       productId,
//       banyak,
//       total_harga,
//       total_bayar,
//       status,
//       tanggal_pesan: new Date(),
//       tanggal_ambil,
//       jam_ambil,
//       catatan,
//       voucherId: voucher ? voucher.id : null,
//       usedVoucher: !!voucherId
//     });

//     res.status(201).json({ message: 'Order berhasil dibuat', order });
//     console.log('banyak', banyak);
//     console.log('banyak', product);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ errorMessage: error.message });
//   }
// };

export const createOrder = async (req, res) => {
  try {
    const { userId, productId, banyak, status, tanggal_ambil, jam_ambil, voucherUsageId, catatan } =
      req.body;

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ errorMessage: 'Produk tidak ditemukan' });
    }

    if (product.stock < banyak) {
      return res.status(400).json({ errorMessage: 'Stok produk tidak mencukupi' });
    }

    product.stock -= banyak;
    await product.save();

    let total_harga = product.harga * banyak;
    let total_bayar = total_harga;

    let voucher = null;
    if (voucherUsageId) {
      const voucherUsage = await VoucherUsage.findByPk(voucherUsageId);

      if (!voucherUsage) {
        return res.status(404).json({ errorMessage: 'Voucher Usage tidak ditemukan' });
      }

      if (voucherUsage.isUsed) {
        return res.status(400).json({ errorMessage: 'Voucher Usage sudah digunakan' });
      }

      voucher = await Voucher.findByPk(voucherUsage.voucherId);

      if (!voucher) {
        return res.status(404).json({ errorMessage: 'Voucher tidak ditemukan' });
      }

      // Mengurangi nilai voucher dari total bayar
      total_bayar -= voucher.jumlah;

      // Jika total bayar negatif, maka ubah menjadi 0
      if (total_bayar < 0) {
        total_bayar = 0;
      }

      voucherUsage.isUsed = true;
      voucherUsage.usedAt = new Date();
      await voucherUsage.save();
    }

    const orderCount = await Order.count(); // Menghitung jumlah order yang sudah ada
    const orderId = `ORD${orderCount + 1}`; // Membuat orderId dengan format "ORD" + nomor urut

    const order = await Order.create({
      orderId,
      userId,
      productId,
      banyak,
      total_harga,
      total_bayar,
      status,
      tanggal_pesan: new Date(),
      tanggal_ambil,
      jam_ambil,
      catatan,
      voucherId: voucher ? voucher.id : null,
      usedVoucher: !!voucherUsageId
    });

    res.status(201).json({ message: 'Order berhasil dibuat', order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error.message });
  }
};

export const deleteOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ errorMessage: 'Order tidak ditemukan' });
    }
    await order.destroy();

    res.json({ message: 'Order berhasil dihapus' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error.message });
  }
};

export const editOrderById = async (req, res) => {
  try {
    const {
      // orderId,
      // userId,
      productId,
      // banyak,
      status
      // tanggal_ambil,
      // jam_ambil,
      // voucherId,
      // catatan
    } = req.body;
    const { orderId: orderToUpdateId } = req.params;
    const order = await Order.findOne({ where: { orderId: orderToUpdateId } });

    if (!order) {
      return res.status(404).json({ errorMessage: 'Order tidak ditemukan' });
    }
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ errorMessage: 'Produk tidak ditemukan' });
    }
    // const total_harga = product.harga * banyak;
    // const voucher = await Voucher.findByPk(voucherId);
    // let harga_setelah_diskon = total_harga - (voucher ? voucher.jumlah : 0);
    // if (harga_setelah_diskon < 0) {
    //   harga_setelah_diskon = 0;
    // }
    await order.update({
      // orderId,
      // userId,
      productId,
      // banyak,
      // total_harga: harga_setelah_diskon,
      status
      // tanggal_ambil,
      // jam_ambil,
      // catatan,
      // voucherId: voucher ? voucher.id : null
    });

    res.json({ message: 'Order berhasil diubah', order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getMonthlySales = async (req, res) => {
  try {
    // Menghitung jumlah pesanan yang selesai per bulan
    const orders = await Order.findAll({
      where: {
        status: 'selesai'
      }
    });

    // Array dengan nama bulan dalam bahasa Indonesia
    const namaBulan = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember'
    ];

    const monthlySales = {};

    orders.forEach((order) => {
      const orderYear = order.tanggal_pesan.getFullYear();
      const orderMonth = order.tanggal_pesan.getMonth();
      const monthYearString = `${namaBulan[orderMonth]} ${orderYear}`;

      if (!monthlySales[monthYearString]) {
        monthlySales[monthYearString] = {
          bulan: monthYearString,
          jumlahPesanan: 0,
          penghasilan: 0
        };
      }

      monthlySales[monthYearString].jumlahPesanan++;
      monthlySales[monthYearString].penghasilan += order.total_harga;
    });

    const sortedSales = Object.values(monthlySales).sort((a, b) => {
      const aDate = new Date(a.bulan);
      const bDate = new Date(b.bulan);
      return aDate - bDate;
    });

    res.json({ sales: sortedSales });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getOrderByPelapakId = async (req, res) => {
  try {
    const { pelapakId } = req.params;
    const orders = await Order.findAll({
      include: [
        {
          model: Product,
          as: 'product',
          where: { pelapakId },
          include: [
            { model: Image, as: 'images' },
            { model: Voucher, as: 'voucher', attributes: ['jumlah', 'name'] }
          ]
        },
        { model: User, as: 'user', attributes: ['name', 'alamat', 'kontak'] }
      ]
    });

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error.message });
  }
};

// let voucher = null;
//     if (voucherId) {
//       voucher = await Voucher.findByPk(voucherId);

//       if (!voucher) {
//         return res.status(404).json({ errorMessage: 'Voucher tidak ditemukan' });
//       }

//       // Mengurangi nilai voucher dari total bayar
//       total_bayar -= voucher.jumlah;

//       // Jika total bayar negatif, maka ubah menjadi 0
//       if (total_bayar < 0) {
//         total_bayar = 0;
//       }

//       // Mengubah status voucher menjadi "digunakan" (isUsed: true)
//       voucher.isUsed = true;
//       await voucher.save();
//     }
