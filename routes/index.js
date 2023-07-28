import express from 'express';
import {
  Login,
  deleteUser,
  editUser,
  getPelapakByID,
  getUserById,
  getUserPelapak,
  getUsers,
  logout,
  register,
  searchPelapak,
  searchUserByName
} from '../controller/user.js';
import { getToken, refresh } from '../middleware/refresh.js';
import {
  addProduct,
  deleteProductById,
  editProductById,
  getProductByIdUser,
  getProductByid,
  getProducts,
  searchProductByName,
  searchProductByPelapak,
  upload
} from '../controller/product.js';
import {
  getOrders,
  getOrderById,
  createOrder,
  deleteOrderById,
  editOrderById,
  getOrdersByUserId,
  getMonthlySales,
  getOrderByPelapakId
} from '../controller/order.js';
import {
  countVoucherUsagePerMonth,
  createVoucher,
  deleteVoucherById,
  deleteVoucherUsageByID,
  deleteVoucherUsageById,
  editVoucherById,
  getAllVoucherUsages,
  getVoucherById,
  getVoucherByUserId,
  getVoucherUsageByUserId,
  getVouchers,
  giveVoucher,
  searchVoucher
} from '../controller/voucher.js';
import { checkToken } from '../middleware/auth.js';

const router = express.Router();

// user
router.get('/api/v1/token', refresh);
router.get('/api/v1/getAllUsers', getUsers);
router.get('/api/v1/getUser/:userId', getUserById);
router.get('/api/v1/getToken/:userId', getToken);
router.post('/api/v1/user/register', register);
router.post('/api/v1/login', Login);
router.post('/api/v1/logout', logout);
router.delete('/api/v1/deleteUser/:userId', deleteUser);
router.put('/api/v1/editUser/:userId', editUser);
router.get('/api/v1/searchUser', searchUserByName);
router.get('/api/v1/pelapak', getUserPelapak);
router.get('/api/v1/pelapak/search', searchPelapak);
router.get('/api/v1/getPelapakById/:id', getPelapakByID);

// product
router.get('/api/v1/products', getProducts);
router.get('/api/v1/product/:productId', getProductByid);
router.get('/api/v1/user/:pelapakId', getProductByIdUser);
router.post('/api/v1/addProduct', upload.array('image'), addProduct);
router.delete('/api/v1/product/:productId', deleteProductById);
router.patch('/api/v1/editProduct/:productId', upload.array('image'), editProductById);
router.get('/api/v1/searchProduct', searchProductByName);
router.get('/api/v1/searchProductPelapak/:pelapakId', searchProductByPelapak);

// order
router.get('/api/v1/orders', getOrders);
router.get('/api/v1/order/:orderId', getOrderById);
router.get('/api/v1/orderUser/:userId', getOrdersByUserId);
router.post('/api/v1/orders', createOrder);
router.delete('/api/v1/deleteOrder/:orderId', deleteOrderById);
router.put('/api/v1/editOrder/:orderId', editOrderById);
router.get('/api/v1/getMountly', getMonthlySales);
router.get('/api/v1/orderPelapak/:pelapakId', getOrderByPelapakId);

// voucher
router.get('/api/v1/vouchers', checkToken, getVouchers);
router.get('/api/v1/voucher/:voucherId', getVoucherById);
router.get('/api/v1/userVoucher/:userId', getVoucherByUserId);
router.post('/api/v1/createVoucher', createVoucher);
router.put('/api/v1/editVoucher/:voucherId', editVoucherById);
router.delete('/api/v1/deleteVoucher/:voucherId', deleteVoucherById);
router.delete('/api/v1/deleteVoucherUsage/:voucherId', deleteVoucherUsageByID);
router.get('/api/v1/searchVoucher', searchVoucher);
router.post('/api/v1/giveVoucher', giveVoucher);
router.get('/api/v1/getAllvoucherUsage', getAllVoucherUsages);
router.delete('/api/v1/deleteVoucherUser/:id', deleteVoucherUsageById);
router.get('/api/v1/voucherUsageUser/:userId', getVoucherUsageByUserId);
router.get('/api/v1/getVoucherPerMounth', countVoucherUsagePerMonth);

export default router;
