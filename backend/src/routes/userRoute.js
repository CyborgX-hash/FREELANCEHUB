const express = require("express")
const usersRouter = express.Router()

const {
    createUserMiddleware,
    loginUserMiddleware,
    logoutUserMiddleware,
    updateUserMiddleware,
} = require("../middlewares/userMiddleware")

const {
    createUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    updateUserController,
} = require("../controllers/userController")

const { 
    authenticate 
} = require("../utils/auth")


usersRouter.post("/register",createUserMiddleware,createUserController)
usersRouter.post("/login",loginUserMiddleware,loginUserController)
usersRouter.post('/logout',logoutUserMiddleware,logoutUserController)
usersRouter.get("/me",authenticate,getMeController)
usersRouter.put("/update", authenticate, updateUserMiddleware, updateUserController);

// Future addition ROUTES :-
// /refresh
// /change-password
// /forgot-password
// /reset-password/:token
// /delete

module.exports = usersRouter;
  