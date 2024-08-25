const multer = require("multer");

function uploadProfilePic() {
    const storage = multer.diskStorage({
        destination: function (req, res, next) {
            next(null, './src/uploads/images/profiles')
        },
        filename: function (req, file, next) {
            next(null, `${req.params.uid}.jpg`);
        }
    });
    
    return multer({storage: storage});
}

module.exports = uploadProfilePic;