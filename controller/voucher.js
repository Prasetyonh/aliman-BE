import { Op } from 'sequelize';
import { User } from '../models/userModels.js';
import { Voucher, VoucherUsage } from '../models/voucherModel.js';

export const getVouchers = async (req, res) => {
  try {
    const voucers = await Voucher.findAll();
    res.json(voucers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getVoucherById = async (req, res) => {
  try {
    const { voucherId } = req.params;
    const voucher = await Voucher.findByPk(voucherId);
    if (!voucher) {
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    }
    res.json(voucher);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error.message });
  }
};

export const createVoucher = async (req, res) => {
  try {
    const { jumlah, name, userId } = req.body;

    let user = null;
    if (userId) {
      user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ errorMessage: 'User tidak ditemukan' });
      }
    }

    const voucher = await Voucher.create({
      jumlah,
      name
    });

    // Jika terdapat user yang terkait, buat juga entitas VoucherUsage
    if (user) {
      await VoucherUsage.create({
        voucherId: voucher.id,
        userId: user.id,
        isUsed: false,
        usedAt: null
      });
    }

    res.status(201).json({ message: 'Voucher berhasil dibuat', voucher });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error.message });
  }
};

export const editVoucherById = async (req, res) => {
  try {
    const { voucherId } = req.params;
    const { jumlah, name, userId } = req.body;
    const voucher = await Voucher.findByPk(voucherId);

    if (!voucher) {
      return res.status(404).json({ errorMessage: 'Voucher tidak ditemukan' });
    }
    voucher.jumlah = jumlah;
    voucher.name = name;
    let user = null;
    let voucherUsage = null;

    if (userId) {
      user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ errorMessage: 'User tidak ditemukan' });
      }
      voucherUsage = await VoucherUsage.findOne({
        where: {
          voucherId,
          userId: user.id
        }
      });

      if (voucherUsage) {
        voucherUsage.isUsed = false;
        voucherUsage.usedAt = null;
        await voucherUsage.save();
      } else {
        voucherUsage = await VoucherUsage.create({
          voucherId,
          userId: user.id,
          isUsed: false,
          usedAt: null
        });
      }
    } else {
      // Jika userId tidak ada, periksa apakah terdapat entitas VoucherUsage yang terkait dan hapus jika ada
      voucherUsage = await VoucherUsage.findOne({
        where: {
          voucherId,
          userId: null
        }
      });

      if (voucherUsage) {
        await voucherUsage.destroy();
      }
    }

    // Menyimpan perubahan pada voucher ke database
    await voucher.save();

    res.json({ message: 'Voucher berhasil diubah', voucher });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error.message });
  }
};

export const deleteVoucherById = async (req, res) => {
  try {
    const { voucherId } = req.params;

    // Mencari voucher berdasarkan ID
    const voucher = await Voucher.findByPk(voucherId);

    if (!voucher) {
      return res.status(404).json({ errorMessage: 'Voucher tidak ditemukan' });
    }

    // Menghapus voucher dari database
    await voucher.destroy();

    res.json({ message: 'Voucher berhasil dihapus' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error.message });
  }
};

export const deleteVoucherUsageByID = async (req, res) => {
  try {
    const { voucherId } = req.params;
    const voucherUsage = await VoucherUsage.findByPk(voucherId);

    if (!voucherUsage) {
      return res.status(404).json({ errorMessage: 'Voucher usage tidak ditemukan' });
    }

    await voucherUsage.destroy();

    res.json({ message: 'Voucher usage berhasil dihapus' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error.message });
  }
};

// export const getVoucherByUserId = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const user = await User.findByPk(userId);

//     if (!user) {
//       return res.status(404).json({ errorMessage: 'Pengguna tidak ditemukan' });
//     }

//     const voucherUsages = await VoucherUsage.findAll({ where: { userId } });

//     if (voucherUsages.length === 0) {
//       return res.status(200).json({ message: 'Pengguna tidak memiliki voucher' });
//     }

//     const voucherIds = voucherUsages.map((voucherUsage) => voucherUsage.voucherId);
//     const vouchers = await Voucher.findAll({ where: { id: voucherIds } });

//     res.json(vouchers);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ errorMessage: error.message });
//   }
// };

export const getVoucherByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ errorMessage: 'Pengguna tidak ditemukan' });
    }

    const vouchers = await Voucher.findAll({
      include: {
        model: VoucherUsage,
        where: { userId }
      }
    });

    res.json(vouchers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error.message });
  }
};

export const searchVoucher = async (req, res) => {
  try {
    const { voucherName } = req.query;
    const vouchers = await Voucher.findAll({
      where: {
        name: {
          [Op.like]: `%${voucherName}%`
        }
      }
    });
    res.json(vouchers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: 'Terjadi kesalahan pada server' });
  }
};

export const giveVoucher = async (req, res) => {
  try {
    const { idVoucher, idUser } = req.body;

    // Periksa apakah voucher dengan idVoucher tersedia
    const voucher = await Voucher.findByPk(idVoucher);
    if (!voucher) {
      return res.status(404).json({ errorMessage: 'Voucher tidak ditemukan' });
    }

    // Periksa apakah user dengan idUser tersedia
    const user = await User.findByPk(idUser);
    if (!user) {
      return res.status(404).json({ errorMessage: 'User tidak ditemukan' });
    }

    // Perbarui voucherId pada tabel User untuk memberikan voucher kepada user
    await User.update({ voucherId: idVoucher }, { where: { id: idUser } });

    // Buat entri baru pada tabel VoucherUsage
    await VoucherUsage.create({
      voucherId: idVoucher,
      userId: idUser,
      isUsed: false,
      usedAt: null
    });

    res.status(200).json({ message: 'Voucher berhasil diberikan kepada pengguna' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getAllVoucherUsages = async (req, res) => {
  try {
    const voucherUsages = await VoucherUsage.findAll({
      include: {
        model: Voucher,
        attributes: ['jumlah', 'name']
      }
    });
    res.json(voucherUsages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data voucher_usages' });
  }
};

export const deleteVoucherUsageById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedVoucherUsage = await VoucherUsage.destroy({
      where: { id }
    });

    if (deletedVoucherUsage) {
      return res.status(200).json({
        success: true,
        message: 'Voucher usage deleted successfully.'
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Voucher usage not found.'
      });
    }
  } catch (error) {
    console.error('Error deleting voucher usage:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting voucher usage.'
    });
  }
};

export const getVoucherUsageByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Mencari pengguna berdasarkan userId
    const user = await User.findByPk(userId);

    // Jika pengguna tidak ditemukan
    if (!user) {
      return res.status(404).json({ errorMessage: 'Pengguna tidak ditemukan' });
    }

    // Mengambil data voucher_usage berdasarkan userId
    const voucherUsage = await VoucherUsage.findAll({
      where: { userId },
      include: {
        model: Voucher
      }
    });

    // Mengirim respons dengan data voucher_usage
    res.json(voucherUsage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error.message });
  }
};

export const countVoucherUsagePerMonth = async (req, res) => {
  try {
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

    const monthlyUsage = {};
    const usages = await VoucherUsage.findAll({
      where: {
        isUsed: true
      }
    });

    usages.forEach((usage) => {
      const usageYear = usage.usedAt.getFullYear();
      const usageMonth = usage.usedAt.getMonth();
      const monthYearString = `${namaBulan[usageMonth]} ${usageYear}`;

      if (!monthlyUsage[monthYearString]) {
        monthlyUsage[monthYearString] = {
          bulan: monthYearString,
          jumlahDipakai: 0
        };
      }

      monthlyUsage[monthYearString].jumlahDipakai++;
    });

    const sortedUsage = Object.values(monthlyUsage).sort((a, b) => {
      const aDate = new Date(a.bulan);
      const bDate = new Date(b.bulan);
      return aDate - bDate;
    });

    res.json({ voucher: sortedUsage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: 'Gagal menghitung voucher_usage per bulan' });
  }
};

// export const getVoucherUsageByIdUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const voucherUsages = await VoucherUsage.findAll({
//       where: {
//         userId
//       }
//     });

//     res.json(voucherUsages);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ errorMessage: error.message });
//   }
// };
