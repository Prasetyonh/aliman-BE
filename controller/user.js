import bcrypt from 'bcrypt';
import { User } from '../models/userModels.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

// mengambil semua data users
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role']
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const getUserPelapak = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        role: 'pelapak'
      },
      attributes: ['id', 'name', 'email', 'role']
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const searchPelapak = async (req, res) => {
  try {
    const { name } = req.query;

    const users = await User.findAll({
      where: {
        role: 'pelapak',
        name: {
          [Op.like]: `%${name}%`
        }
      },
      attributes: ['id', 'name', 'email', 'role']
    });
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error.message });
  }
};

// mencari user berdasarkan nama
export const searchUserByName = async (req, res) => {
  try {
    const { userName } = req.query;
    // Mencari produk berdasarkan nama produk
    const products = await User.findAll({
      where: { name: { [Op.like]: `%${userName}%` } }
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: 'Terjadi kesalahan pada server' });
  }
};
// registrasi
export const register = async (req, res) => {
  const { name, email, password, role, no_kk, kontak, alamat } = req.body;

  try {
    // Periksa apakah pengguna dengan email yang sama sudah terdaftar dalam database
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }
    const existingNoKK = await User.findOne({ where: { no_kk } });
    if (existingNoKK) {
      return res.status(400).json({ error: 'Nomor KK sudah terdaftar' });
    }

    // Enkripsi password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Buat pengguna baru
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      no_kk,
      kontak,
      alamat
    });

    res.status(201).json({ message: 'Registrasi berhasil', User: newUser });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Terjadi kesalahan saat melakukan registrasi', errorMessage: error.message });
  }
};

// login
// export const Login = async (req, res) => {
//   try {
//     const user = await User.findOne({
//       where: {
//         email: req.body.email
//       }
//     });

//     if (!user) {
//       return res.status(404).json({ msg: 'Email tidak ditemukan' });
//     }

//     const match = await bcrypt.compare(req.body.password, user.password);
//     if (!match) {
//       return res.status(400).json({ msg: 'Password salah' });
//     }

//     const date = new Date();
//     const userId = user.id;
//     const userName = user.name;
//     // const email = user.email;
//     const userRole = user.role; // Mengambil nilai userRole dari data pengguna yang masuk
//     const refreshToken = jwt.sign(
//       { userId, userName, date, userRole },
//       process.env.ACCESS_TOKEN_SECRET,
//       {
//         expiresIn: '1d'
//       }
//     );
//     await User.update(
//       { refreshToken: refreshToken },
//       {
//         where: {
//           id: userId
//         }
//       }
//     );
//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: false,
//       maxAge: 24 * 60 * 60 * 1000,
//       secure: false
//     });
//     res.cookie('Role', userRole, {
//       httpOnly: false,
//       maxAge: 24 * 60 * 60 * 1000,
//       secure: false
//     });
//     res.cookie('userId', userId, {
//       httpOnly: false,
//       maxAge: 24 * 60 * 60 * 1000,
//       secure: false
//     });

//     console.log('Cookies:', req.cookies);
//     res.json([{ userRole, userId, userName }]);
//   } catch (error) {
//     res.status(500).json({ msg: 'Terjadi kesalahan server', error: error.message });
//   }
// };

export const Login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      return res.status(404).json({ msg: 'Email tidak terdaftar' });
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(400).json({ msg: 'Password salah' });
    }

    const date = new Date();
    const userId = user.id;
    const userName = user.name;
    const userRole = user.role;
    const refreshToken = jwt.sign(
      { userId, userName, date, userRole },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '1d'
      }
    );

    await User.update(
      { refreshToken: refreshToken },
      {
        where: {
          id: userId
        }
      }
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false
    });
    res.cookie('Role', userRole, {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false
    });
    res.cookie('userId', userId, {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false
    });

    console.log('Cookies:', req.cookies);
    res.json([{ user: { userRole, userId, userName }, token: refreshToken }]);
  } catch (error) {
    res.status(500).json({ msg: 'Terjadi kesalahan server', error: error.message });
  }
};

// logout
export const logout = async (req, res) => {
  try {
    // Menghapus semua cookie pada sisi klien
    res.clearCookie('refreshToken');
    res.clearCookie('userRole');
    res.clearCookie('userId');
    res.clearCookie('Role');
    res.status(200).json({ msg: 'Logout berhasil' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Terjadi kesalahan server', errorMessage: error.message });
  }
};

// mengambil data user sesuai dengan id
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Mencari pengguna berdasarkan ID
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'role', 'kontak', 'alamat', 'no_kk']
    });

    if (!user) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Terjadi kesalahan server', errorMessage: error.message });
  }
};

// edit User
export const editUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, role, kontak, alamat, password, no_kk } = req.body;

    // Mencari pengguna berdasarkan ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    }

    // Mengedit atribut-atribut pengguna
    user.name = name;
    user.email = email;
    user.role = role;
    user.kontak = kontak;
    user.no_kk = no_kk;
    user.alamat = alamat;
    if (password) {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    await user.save();
    console.log(req.headers);
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Terjadi kesalahan server', errorMessage: error.message });
  }
};

// delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ errorMessage: 'Pengguna tidak ditemukan' });
    }

    await user.destroy();
    res.json({ message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error.message });
  }
};

export const refreshToken = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ msg: 'Pengguna tidak ditemukan' });
    }

    const accessToken = jwt.sign(
      { userId: user.id, name: user.name },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '20s'
      }
    );
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ msg: 'Terjadi kesalahan server', error: error.message });
  }
};

export const getPelapakByID = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: {
        id,
        role: 'pelapak'
      },
      attributes: ['id', 'name', 'email', 'role']
    });

    if (!user) {
      return res.status(404).json({ errorMessage: 'Pelapak tidak ditemukan' });
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error.message });
  }
};
