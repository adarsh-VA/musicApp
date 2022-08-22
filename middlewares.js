const multer = require('multer');
const path = require('path');

module.exports.storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'/public/images'))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+file.originalname;
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })

module.exports.isLoggedIn = (req,res,next)=>{
  if(!req.isAuthenticated()){
    req.flash('error','You must login first')
    return res.redirect('/user/login')
  }
  next();
}