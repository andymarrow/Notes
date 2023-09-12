const express=require('express');
const router=express.Router();
const mainController= require('../controllers/mainController');


router.get('/',mainController.homepage);
router.get('/About',mainController.About);





module.exports= router;