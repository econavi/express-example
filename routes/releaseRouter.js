const Router = require('express')
const router = new Router()

const releaseController = require('../controllers/releaseController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post('/', checkRoleMiddleware('ADMIN'), releaseController.create)
router.get('/', releaseController.getAll)
router.get('/:id', releaseController.getOne)

// Todo: router.delete('/')

module.exports = router
