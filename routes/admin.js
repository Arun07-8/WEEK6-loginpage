const express=require('express')
const router=express.Router();
const  adminController=require("../controller/adminController")
const adminAuth=require("../middleware/adminAuth")


router.get('/adminLogin',adminAuth.isLogin,adminController.loadLogin);
router.post('/adminLogin',adminController.login);
router.get('/dashBoard',adminAuth.checkSession,adminController.loadDashboard);
router.post('/edit-user',adminController.editUser);
router.get('/delete-user',adminAuth.checkSession,adminController.deleteUser);
router.post('/delete-user',adminAuth.checkSession,adminController.deleteUser);
router.post('/add-user',adminAuth.checkSession,adminController.addUser);
router.post('/search',adminController.searchUser);
router.post('/logout',adminAuth.checkSession,adminController.logout);
module.exports=router;

