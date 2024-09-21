const {
    createUserDb, 
    // getUserByEmailDb, 
    getUserByIdDb, 
    // getUserByUsernameDb, 
    getAllUsersDb, 
    // deleteUserDb, 
    // changeUserPasswordDb, 
    // updateUserDb,
} = require("../db/user.db");

const {ErrorHandler} = require("../helpers/error");

class UserService {
   
    getAllUsers = async (page) => {
        const limit = 12;
        const offset = (page - 1) * limit;
        try {
           return  await getAllUsersDb({limit, offset});
        } catch (error) {
            throw new ErrorHandler(error.statusCode, error.message);
        }
    };

  
    getUserById = async (id) => {
        try {
            const user = await getUserByIdDb(id);
            return user;
        } catch (error) {
            throw new ErrorHandler(error.statusCode, error.message);
        }
    };


    updateUser = async (user) => {
        const {email, username, id} = user;
        const errors = {};

        try {
            const getUser = await getUserByIdDb(id);
            const findUserByEmail = await getUserByEmailDb(email);
            const findUserByUsername = await getUserByUsernameDb(username);
            const emailChanged = 
              email && getUser.email.toLowerCase() !== email.toLowerCase();
            
              const usernameChanged = 
              username && getUser.username.toLowerCase() !== username.toLowerCase();  

              if(emailChanged && typeof findUserByEmail === "object") {
                errors["email"] = "Email is already taken";
              }

              if(usernameChanged && typeof findUserByUsername === "object"){
                errors["username"] = "username already taken";
              }

              if(Object.keys(errors).length > 0) {
                throw new ErrorHandler(403, errors);
              }

              return updateUserDb(user);
        } catch (error) {
            
        }
    }
   
}


module.exports = new UserService();