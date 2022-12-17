const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('User login')
})

const signUp = require('../controllers/user/signUp')
router.get('/signUp', signUp.signUpPage)
router.post('/signUp', signUp.registerUser)
router.get('/otp_verification', signUp.otpPage)
router.post('/otp_verification', signUp.otpVerification)

const signIn = require('../controllers/user/signIn') 
router.get('/signIn', signIn.signInPage)
router.post('/signIn', signIn.userVerification)

const signOut = require('../controllers/user/signOut')
router.get('/',signOut.signOut)

module.exports = router;