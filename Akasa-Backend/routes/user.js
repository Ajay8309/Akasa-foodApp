const {
    getAllUsers, 
    // createUser, 
//     deleteUser, 
    getUserById, 
    updateUser, 
    getUserProfile
} = require("../controllers/user.controller.js");

const router = require("express").Router();
// const verifyAdmin = require("../middleware/verifyAdmin");
const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken);
router.route("/").get( getAllUsers)
router.route("/profile").get(getUserProfile);
router.route("/:id").get(getUserById).put(updateUser);

module.exports = router;