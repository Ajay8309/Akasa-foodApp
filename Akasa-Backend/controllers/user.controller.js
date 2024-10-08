const userService = require("../services/user.service");
const {ErrorHandler} = require("../helpers/error");
// const {hashPassword} = require("../helpers/hashPassword");

const getAllUsers = async (req, res) => {
    const {page = 1} = req.query;
    const results = await userService.getAllUsers(page);
    res.status(200).json(results);
};


const getUserProfile = async (req, res) => {
    const {id} = req.user;
    const user = await userService.getUserById(id);
    return res.status(200).json(user);
};

const getUserById = async (req, res) => {
    const {id} = req.params;

    // if(+id === req.user.id || req.user.roles.includes("admin")) {
        try {
            const user = await userService.getUserById(id);
            return res.status(200).json(user);
        } catch (error) {
            throw new ErrorHandler(error.statusCode, "user not found");
        }
    // }
    // throw new ErrorHandler(401, "unauthorized");
};

const updateUser = async (req, res) => {
    const {username, email, fullname, address, city, state, country} = req.body;
    // if(+req.params.id === req.user.id || req.user.roles.includes("admin")) {
        const id = req.params.id;
        const user = await userService.getUserById(id);
        // console.log(user)
        try {
            const results = await userService.updateUser({
                username: username || user.username, 
                email: email || user.email, 
                fullname: fullname || user.fullname, 
                address, 
                city, 
                state, 
                country, 
                id : req.params.id
            });
            return res.status(201).json(results);
        } catch (error) {
            throw new ErrorHandler(error.statusCode, error.message);
        }
    // }
    // throw new ErrorHandler(401, "Unauthorized");
};


module.exports = {
    getAllUsers, 
    // createUser, 
    getUserById, 
    getUserProfile, 
    updateUser, 
    // deleteUser, 
}


