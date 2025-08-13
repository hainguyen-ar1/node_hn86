import { users } from "../data.js";
import { UserModel } from "../models/schema/user_model.js";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import { generateToken } from "../middleware/auth.js";
import { getSimpRes, getSimpResData } from "../const/wrap_response.js";
// import  {ResMessage, ResStatus } from "../const/response.enum.js";
import res_mess from "../const/res_mess.js";
// const ResStatus = require('../const/ResStatus.js');
import { StatusRes } from "../const/ResStatus.js";
// import res_enum from "../const/res_enum.js";


// @desc Import all user
// @route POST /api/users/import
// @access Private/Admin
const importUsers = expressAsyncHandler(async (req, res) => {
    await UserModel.deleteMany({});
    const createUser = await UserModel.insertMany(users);
    const response = createUser.map(user => ({ fullName: user.fullName, email: user.email, phone: user.phone, image: user.image, isAdmin: user.isAdmin }));
    res.status(201).send(response);
    // res.status(201).send(createUser);
});
// const importUsers = expressAsyncHandler(async (req, res) => {
//     const data = req.body;
//     const users = await UserModel.insertMany(data);
//     res.status(200).json(users);
// });

// @decs Login user 
// @route POST /api/users/login
// @access Public

const loginUser = expressAsyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        //find user by email
        const user = await UserModel.findOne({ email });
        //check if user exist
        if (user) {
            //check if password is correct
            if (bcrypt.compareSync(password, user.password)) {
                res.status(200).json(getSimpResData(
                    {
                        status: StatusRes.SUCCESS,
                        // status: "success",
                        message: "login succes",
                        data: {
                            _id: user._id,
                            fullName: user.fullName,
                            email: user.email,
                            phone: user.phone,
                            image: user.image,
                            isAdmin: user.isAdmin,
                            token: generateToken(user._id),
                        },
                    }
                ));
            } else {
                // res.status(401).json(simpResponse({ status: "ResStatus.ERROR", message: "ResMessage.ERROR" }));
                // res.status(401).json(getSimpRes({ status: "ResStatus.ERROR", message: "ResMessage.ERROR" }));
                // res.status(401).json(getSimpRes({ status: res_status.ERROR, message: res_enum.ResMessage.ERROR }));
                res.status(401).json(getSimpRes({ status: "error", message: "Invalid password" }));
            }
        } else {
            res.status(401).json(getSimpRes("error", "user not found in database    "));
        }

    } catch (e) {
        console.log(e);
    }
});

const registerUser = expressAsyncHandler(async (req, res) => {
    try {
        const { fullName, email, password, phone, image, gender } = req.body;
        const userExist = await UserModel.findOne({ email });
        if (userExist) {
            res.status(400).json(getSimpRes({ status: "error", message: "User already exist" }));
        }
        const user = await UserModel.create({
            fullName,
            email,
            password: bcrypt.hashSync(password, 10),
            phone,
            image,
            gender,
        });
        if (user) {
            res.status(201).json(getSimpResData(
                {
                    status: "success",
                    message: "User created successfully",
                    data: {
                        _id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                        phone: user.phone,
                        image: user.image,
                        isAdmin: user.isAdmin,
                        gender: user.gender,
                        token: generateToken(user._id),
                    },
                }
            ));
        } else {
            res.status(400).json(getSimpRes({ status: "error", message: "Invalid user data" }));
        }
    } catch (e) {
        res.status(401).json(getSimpRes({ status: "error", message: e }));
    }
});

const updateProfile = expressAsyncHandler(async (req, res) => {
    try {
        console.log("---req.user", req.user);
        const user = await UserModel.findById(req.user._id);
        if (user) {
            user.fullName = req.body.fullName || user.fullName;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.gender = req.body.gender || user.gender;
            // if (req.body.password) {
            //     user.password = bcrypt.hashSync(req.body.password, 10);
            // }
            const updateUser = await user.save();
            res.status(200).json(getSimpResData(
                {
                    status: "success",
                    message: "User updated successfully",
                    data: {
                        _id: updateUser._id,
                        fullName: updateUser.fullName,
                        email: updateUser.email,
                        phone: updateUser.phone,
                        image: updateUser.image,
                        gender: updateUser.gender,
                        isAdmin: updateUser.isAdmin,
                        token: generateToken(updateUser._id),
                    },
                }
            ));
        } else {
            res.status(404).json(getSimpRes({ status: "error", message: "User not found" }));
        }
    } catch (e) {
        res.status(401).json(getSimpRes({ status: "error", message: e.message }));
    }
});

const deleteUser = expressAsyncHandler(async (req, res) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.user._id);
        if (user) {
            res.status(200).json(getSimpRes({ status: "success", message: "User deleted successfully" }));
        } else {
            res.status(404).json(getSimpRes({ status: "error", message: "User not found" }));
        }
    } catch (e) {
        res.status(401).json(getSimpRes({ status: "error", message: e.message }));
    }
});

const changePassword = expressAsyncHandler(async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id);
        if (user) {
            if (bcrypt.compareSync(req.body.oldPassword, user.password)) {
                user.password = bcrypt.hashSync(req.body.newPassword, 10);
                const updateUser = await user.save();
                res.status(200).json(getSimpRes({ status: "success", message: "Password updated successfully", data: updateUser }));
            } else {
                res.status(401).json(getSimpRes({ status: "error", message: "Invalid old password" }));
            }
        } else {
            res.status(404).json(getSimpRes({ status: "error", message: "User not found" }));
        }
    } catch (e) {
        res.status(401).json(getSimpRes({ status: "error", message: e.message }));
    }
});


const getUserProfile = expressAsyncHandler(async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id);
        if (user) {
            res.status(200).json(getSimpResData(
                {
                    status: "success",
                    data: {
                        _id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                        phone: user.phone,
                        image: user.image,
                        isAdmin: user.isAdmin,
                        gender: user.gender,
                        currentRoom: user.currentRoom,
                        isOnline: user.isOnline,
                        isWaiting: user.isWaiting,
                    },
                }
            ));
        } else {
            res.status(404).json(getSimpRes({ status: "error", message: "User not found" }));
        }
    } catch (e) {
        res.status(401).json(getSimpRes({ status: "error", message: e.message }));
    }
});

export { importUsers, loginUser, registerUser, updateProfile, deleteUser, changePassword, getUserProfile };

