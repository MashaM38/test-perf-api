const express = require ('express');

const router = express.Router();

const { getUserById } = require('../controllers/usersController');
const { getAllUsers } = require('../controllers/usersController');

router.get('/:id', getUserById);
router.get('/', getAllUsers);

module.exports = router;
