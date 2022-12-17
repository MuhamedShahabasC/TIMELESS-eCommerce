const express = require('express')
const router = express.Router()


const signIn = require('../controllers/admin/signIn')
router.get('/', signIn.signInPage)
router.post('/',signIn.adminVerification)

const signOut = require('../controllers/admin/signOut')
router.get('/',signOut.signOut)

router.get('/dashboard', (req, res) => {
    res.send('This is dashboard')
})

module.exports = router;