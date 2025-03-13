const express = require('express');

const router = express.Router();


// test routes
router.get('/test', (req,res)=>{
    console.log("test")
    res.status(200).json({msg: "test route"})
});


module.exports = router;
