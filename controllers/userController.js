const db = require("../db/queries");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const passport = require("passport");
const renderErrorPage = require("../helpers/renderErrorPage");
require("../auth/auth");

// Helper: Hash password
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Display Welcome Page (GET)
exports.index = asyncHandler(async(req, res, next) => {    
    res.render("index", {
        title: "File Uploader"
    });
});

// List of all users (GET)
exports.user_list = asyncHandler(async(req, res, next) => {
    try {
        const users = await db.getAllUsers();
        res.json(users);
    } catch (err) {
        renderErrorPage(res, err);
    }
});

// Display user create form (GET)
exports.user_create_get = asyncHandler(async(req, res, next) => {
    res.render("userCreateForm", {
        message: "",
    });
});

// Handle User create (POST)
exports.user_create_post = [
    body("username")
        .trim()
        .isLength({min: 1, max: 30})
        .escape()
        .withMessage("Username must be specified"),
    body("password", "Password must be between 8 and 20 characters long").isLength({ min: 8, max: 20 }),
    body("confirmPassword").custom(async (confirmPassword, { req }) => {
        // If passwords do not match throw error
        if (req.body.password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }
    }),
    // Process request after validation and sanitisation
    asyncHandler(async(req, res, next) => {
        // Extract validation errors from a request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("userCreateForm", {
                message: errors.array().map(err => err.msg).join(", "),
            })
        }
        // Check for existing username
        const existingUser = await db.getUserByUsername(req.body.username);
        if (existingUser) {
            return res.render("userCreateForm", { 
                message: "Username already taken" 
            });
        }
        // Hash password and create new user
        try {
            const hashedPassword = await hashPassword(req.body.password);
            await db.createUser({
                username: req.body.username,
                password: hashedPassword,
            });
            // Redirect to login page
            res.render("userLoginForm", {
                message: "Account successfully created. Please log in"
            });
        } catch (err) {
            renderErrorPage(res, err);
        }
    })
];

// Display login form (GET)
exports.user_login_get = asyncHandler(async(req, res, next) => {
    res.render("userLoginForm", {
        message: "",
    });
});

// Handle login (POST)
exports.user_login_post = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            // Authentication failed: Render login form with a failure message
            return res.render("userLoginForm", { 
                message: info?.message || "Log in failed. Please try again" 
            });
        }
        // Log user in and redirect on success
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect(`/uploads/user/${user.id}/home`);
        });
    })(req, res, next);
};

// Display logout confirmation (GET)
exports.user_logout_confirm_get = (req, res, next) => res.render("logoutConfirm");

// Handle User log out on (GET)
exports.user_logout_get = (req, res, next) => {
    req.logout((err) => (err ? next(err) : res.redirect("/uploads")));
}

// Details of a single user (GET)
exports.user_detail = asyncHandler(async(req, res, next) => {
    try {
        const user_id = parseInt(req.params.id);
        const userDetails = await db.getUserByID(user_id);
        res.json(userDetails);
    } catch (err) {
        renderErrorPage(res, err);
    }
});

// Display User Home Page (GET)
exports.user_home_get = asyncHandler(async(req, res, next) => res.render("userHomePage"));

// Display User update form (GET)
exports.user_update_get = asyncHandler(async(req, res, next) => res.render("userUpdateForm", { message: "" }));

// Handle User update (POST)
exports.user_update_post = [
    body("username")
        .trim()
        .isLength({ min: 1, max: 30 })
        .escape()
        .withMessage("Username must be between 1 and 30 characters")
        .optional(),
    body("password", "Password must be between 8 and 20 characters long").isLength({ min: 8, max: 20 }).optional(),
    body("confirmPassword").custom((confirmPassword, { req }) => {
        if (req.body.password && req.body.password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }
        return true;
    }),
    asyncHandler(async (req, res, next) => {
        // Extract validation errors from the request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("userUpdateForm", { 
                message: errors.array().map(err => err.msg).join(", "),
            });
        }
        const user_id = parseInt(req.params.id);
        const { newUsername, newPassword } = req.body;
        // Check for existing username
        const existingUser = await db.getUserByUsername(newUsername);
        if (existingUser && existingUser.id !== user_id) {
            return res.render("userUpdateForm", {
                message: "That username is already in use",
            });
        }
        // Hash new password if provided
        let updatedFields = { id: user_id, username: newUsername };
        if (newPassword) updatedFields.password = await hashPassword(newPassword);
        try {
            await db.updateUser(updatedFields);
            // Redirect to user's home page
            res.redirect(`/uploads/user/${user_id}/home`);
        } catch (err) {
            renderErrorPage(res, err);
        }
    })
];

// Display User delete confirmation (GET)
exports.user_delete_get = asyncHandler(async(req, res, next) => res.render("userDeleteForm"));

// Handle User delete (POST)
exports.user_delete_post = asyncHandler(async(req, res, next) => {
    try {
        await db.deleteUser(parseInt(req.params.id));
        res.render('accountDeleted')
    } catch (err) {
        renderErrorPage(res, err);
    }
});