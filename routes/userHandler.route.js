const express = require('express');

const router = express.Router();

const { updateUser,
    deleteUser
} = require('../controllers/userHandler.controller');

router.put('/update:id', updateUser);
router.delete('/delete:id', deleteUser);


module.exports = router;