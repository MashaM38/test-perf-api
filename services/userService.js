const userRepository = require('../repositories/userRepository');

function getUserById(id) {
    return userRepository.getUserById(id);
}

function getAllUsers() {
    return userRepository.getAllUsers();
}

module.exports = {
    getUserById,
    getAllUsers
};