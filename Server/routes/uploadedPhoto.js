const {Router} = require('express')
const multer = require('multer');
const path = require("path");
const router = Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'avatars/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });
router.post('/upload', upload.single('photo'), (req, res) => {
    console.log("Фото сохранено!!")
});


const uploadAvatar = multer({ storage: avatarStorage} );
router.post('/uploadAvatar', uploadAvatar.single('avatar'), (req, res) => {
    console.log("Аватар сохранен!!")
});

router.get(
    '/photo/:imageName',
    async (req, res) => {
        try {
            const imageName = req.params.imageName;
            const imagePath = path.join(__dirname, '../uploads', imageName);
            res.sendFile(imagePath);
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    })

router.get(
    '/avatar/:imageName',
    async (req, res) => {
        try {
            const imageName = req.params.imageName;
            const imagePath = path.join(__dirname, '../avatars', imageName);
            res.sendFile(imagePath);
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    })

module.exports = router