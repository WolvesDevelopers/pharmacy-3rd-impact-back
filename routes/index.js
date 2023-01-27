'use strict'

const router = require('express').Router()

router.use('/user', require('./user.route'))
router.use('/office', require('./office.route'))
router.use('/medicine', require('./medicine.route'))
router.use('/inventory', require('./inventory.route'))


module.exports = router



