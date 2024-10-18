const db = require("../db/queries");
const asyncHandler = require("express-async-handler");

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

// Details of a single user
exports.user_detail = asyncHandler(async(req, res, next) => {
    try {
        const user = await db.getUser(req.params.id);
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
          });
    }

});

// GET User create form
exports.user_create_get = asyncHandler(async(req, res, next) => {
    res.render("userCreateForm");
});

// Handle User create on POST
exports.user_create_post = asyncHandler(async(req, res, next) => {
    try {
        const { user } = req.body;
        await db.createUser(user)
        res.json({message: "User created: ${user.username"});
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        });
    }
});

// GET User login form
exports.user_login_get = asyncHandler(async(req, res, next) => {
    res.render("userLoginForm");
})

// Handle User login on POST
exports.user_login_post = asyncHandler(async(req, res, next) => {
    // IMPLEMENT USER LOGIN
}) 

// GET User update form
exports.user_update_get = asyncHandler(async(req, res, next) => {
    const user = req.params.id;
    res.render("userUpdateForm", {
        user: user
    });
});

// Handle User update on POST
exports.user_update_post = asyncHandler(async(req, res, next) => {
    try {
        const { user } = req.body;
        user.id = req.params.id;
        await db.updateUser(user)
        res.json({message: "User updated"});
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        });
    }
});

// GET User delete form
exports.user_delete_get = asyncHandler(async(req, res, next) => {
    const user = req.params.id;
    res.render("userDeleteForm", {
        user: user
    });
});

// Handle User delete on POST
exports.user_delete_post = asyncHandler(async(req, res, next) => {
    try {
        const user_id = req.params.id;
        await db.deleteUser(user_id);
        res.json({
            message: "User deleted",
            user_id: user_id
        });
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        });
    }
});
