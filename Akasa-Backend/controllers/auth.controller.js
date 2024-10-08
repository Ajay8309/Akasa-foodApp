const authService = require("../services/auth.service");
const mail = require("../services/mail.service");
const {ErrorHandler} = require("../helpers/error");

const createAccount = async (req, res) => {
    const {token, refreshToken, user} = await authService.signUp(req.body);

    // test kaa code likhnaa hai yahaa baadme 

    await mail.signupMail(user.email, user.fullname.split(" ")[0]);

    res.header("auth-token", token); 
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite : process.env.NODE_ENV === "development" ? true : "none",
        secure : process.env.NODE_ENV === "development" ? false : true,
    });

    res.status(201).json({
        token,
        user,
    });
};

const loginUser = async (req, res) => {
    const {email, password} = req.body;
    const {token, refreshToken, user} = await authService.login(email, password);

    res.header("auth-token", token);
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite : process.env.NODE_ENV === "development" ? true : "none",
        secure : process.env.NODE_ENV === "development" ? false : true,
    });

    res.status(200).json({
        token,
        user,
    });
}



const forgotPassword = async (req, res) => {
    const {email} = req.body;

    await authService.forgotPassword(email);
    res.json({status: "OK"});
};

const verifyResetToken = async (req, res) => {
    const {token, email} = req.body;
    // const curDate = new Date();

    const isTokenValid = await authService.verifyResetToken(token, email);

    if(!isTokenValid) {
        res.json({
            message : "Token has expired. please try reset password again .",
            showForm : false,
        });
    }else{
        res.json({
            showForm : true,
        });
    }
};

const refreshToken = async (req, res) => {
    if (!req.cookies.refreshToken) {
        throw new ErrorHandler(401, "token missing");
    }
    const tokens = await authService.generateRefreshToken(req.cookies.refreshToken);
    console.log(tokens.token);

    res.header("auth-token", tokens.token);
    res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
    });
    res.json(tokens);
};


const resetPassword = async (req, res) => {
    const {password, password2, token, email} = req.body;

    await authService.resetPassword(password, password2, token, email);

    res.json({
        status : "OK",
        message : "Password reset. Please Login with your new Password."
    });
};

module.exports = {
    createAccount, 
    loginUser,
    forgotPassword, 
    verifyResetToken,
    resetPassword,
    refreshToken,
}