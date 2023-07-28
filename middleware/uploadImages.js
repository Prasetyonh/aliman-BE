// import multer from 'multer';

// // Konfigurasi penyimpanan gambar
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Tentukan folder tujuan penyimpanan gambar
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // Buat nama unik untuk gambar
//     const fileExtension = file.originalname.split('.').pop(); // Ambil ekstensi file

//     cb(null, uniqueSuffix + '.' + fileExtension); // Gabungkan nama unik dan ekstensi file
//   }
// });

// // Konfigurasi multer
// const Upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5 // Batasan ukuran file (dalam byte). Contoh: 5MB
//   },
//   fileFilter: (req, file, cb) => {
//     // Filter jenis file yang diizinkan
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Jenis file yang diunggah tidak valid.'));
//     }
//   }
// });

// export default Upload;
