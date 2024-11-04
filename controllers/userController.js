const db = require("../db/queries");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const passport = require("passport");
require("../auth/auth");

// Welcome Page
exports.index = asyncHandler(async(req, res, next) => {    
    res.render("index", {
        title: "File Uploader"
    });
});

// List of all users
exports.user_list = asyncHandler(async(req, res, next) => {
    try {
        const users = await db.getAllUsers();
        console.log("Users: ", users);
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        })
    }
});

// GET User create form
exports.user_create_get = asyncHandler(async(req, res, next) => {
    res.render("userCreateForm", {
        message: "",
    });
});

// Handle User create on POST
exports.user_create_post = [
    body("username")
        .trim()
        .isLength({min: 1, max: 30})
        .escape()
        .withMessage("Username must be specified"),
    body("password", "Password must be between 8 and 20 characters long").isLength({ min: 8, max: 20 }),
    body("confirmPassword").custom(async (confirmPassword, { req }) => {
        const password = req.body.password;
        // If passwords do not match throw error
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }
    }),
    // Process request after validation and sanitisation
    asyncHandler(async(req, res, next) => {
        // Extract validation errors from a request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorsString = errors.array().map(el => `Error: ${el.msg}`).toString();
            return res.render("userCreateForm", {
                message: errorsString,
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
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = {
                username: req.body.username,
                password: hashedPassword,
            };
            await db.createUser(user);
            // Redirect to login page
            return res.render("userLoginForm", {
                message: "Account successfully created. Please log in"
            });
        } catch (err) {
            console.error(err);
            return res.status(500).render("error", { 
                error: err 
            });
        }
    })
];

// GET User login form
exports.user_login_get = asyncHandler(async(req, res, next) => {
    res.render("userLoginForm", {
        message: "",
    });
});

// Handle User login on POST
exports.user_login_post = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // Authentication failed: Render login form with a failure message
            return res.render("userLoginForm", { message: info ? info.message + ". Please try again": "Log in failed. Please try again"});
        }
        // Log user in and redirect on success
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect(`/uploads/user/${user.id}/home`);
        });
    })(req, res, next);
};

// Handle User log out on GET
exports.user_logout_get = (req, res, next) => {
    req.logout((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/uploads");
      });
}

// Details of a single user
exports.user_detail = asyncHandler(async(req, res, next) => {
    try {
        const user_id = parseInt(req.params.id);
        const userDetails = await db.getUserByID(user_id);
        res.json(userDetails);
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
          });
    }
});

// GET User Home Page
exports.user_home_get = asyncHandler(async(req, res, next) => {
    res.render("userHomePage")
});

// GET User update form
exports.user_update_get = asyncHandler(async(req, res, next) => {
    res.render("userUpdateForm", {
        message: "",
    });
});

// Handle User update on POST
exports.user_update_post = [
    body("username")
        .trim()
        .isLength({ min: 1, max: 30 })
        .escape()
        .withMessage("Username must be between 1 and 30 characters")
        .optional(),
    body("password", "Password must be between 8 and 20 characters long").isLength({ min: 8, max: 20 }).optional(),
    body("confirmPassword").custom((confirmPassword, { req }) => {
        const password = req.body.password;
        if (password && password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }
        return true;
    }),

    asyncHandler(async (req, res, next) => {
        try {
            // Extract validation errors from the request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorsString = errors.array().map(el => `Error: ${el.msg}`).join(", ");
                return res.render("userUpdateForm", { message: errorsString });
            }
            const user_id = parseInt(req.params.id);
            const { newUsername, newPassword, confirmNewPassword } = req.body;
            // Check if username already exists for a different user
            const existingUser = await db.getUserByUsername(newUsername);
            if (existingUser && existingUser.id !== user_id) {
                return res.render("userUpdateForm", {
                    message: "That username is already in use",
                });
            }
            // Check if passwords match and hash the new password if provided
            let hashedPassword;
            if (newPassword) {
                if (newPassword !== confirmNewPassword) {
                    return res.render("userUpdateForm", {
                        message: "Passwords do not match",
                    });
                }
                hashedPassword = await bcrypt.hash(newPassword, 10);
            }
            // Update user
            const user = {
                id: user_id,
                username: newUsername,
                ...(hashedPassword && { password: hashedPassword }) // Only include password if it’s updated
            };
            await db.updateUser(user);
            // Redirect to user's home page
            return res.redirect(`/uploads/user/${user_id}/home`);
        } catch (err) {
            console.error(err);
            return res.status(500).render("error", { error: err });
        }
    })
];

// GET User delete form
exports.user_delete_get = asyncHandler(async(req, res, next) => {
    try {
        //const user_id = parseInt(req.params.id);
        //const user = await db.getUserByID(user_id);
        res.render("userDeleteForm");
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        });
    }
});

// Handle User delete on POST
exports.user_delete_post = asyncHandler(async(req, res, next) => {
    try {
        const user_id = parseInt(req.params.id);
        await db.deleteUser(user_id);
        res.render('accountDeleted')
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        });
    }
});