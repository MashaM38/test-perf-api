const userService = require('../services/userService');

async function getUserById(req, res) {
    const id = req.params.id;

    try {
        const user = userService.getUserById(id);
        if (!user) {

            return res.status(404).json({
                error: 'User not found'
            });

        }
        res.json(user);
    
        } catch(err) {
            res.status(500).json({
                error: err.message
            });
        }
}

async function getAllUsers(req, res) {
    try {
        const users = userService.getAllUsers();
        res.json(users);
    } catch(err) {
        res.status(500).json({
            error: err.message
        })
    }    
}

module.exports = {
    getUserById,
    getAllUsers
};
