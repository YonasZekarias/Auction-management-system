const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const { addProduct, viewAllUser} = require('../controllers/admin.controller')


router.post('/add-product', protect,addProduct)
router.get('/view-all-users',protect,viewAllUser)


module.exports = router;