const db = require("../db/queries");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const renderErrorPage = require("../helpers/renderErrorPage");

// List of all folders for a user (GET)
exports.folders_list = asyncHandler(async(req, res, next) => {    
    try {
        const folders = await db.getAllFolders(parseInt(req.params.id));
        res.json(folders);
    } catch (err) {
        renderErrorPage(res, err);
    }
});

// Details of a single folder (GET)
exports.folder_detail = asyncHandler(async(req, res, next) => {
    try {
        const folder = await db.getFolderByID(parseInt(req.params.id));
        res.render("folderDetails", {
            folder,
            files: folder.files,
        });
    } catch (err) {
        renderErrorPage(res, err);
    }
});

// Display Folder create form (GET)
exports.folder_create_get = asyncHandler(async(req, res, next) => res.render("folderCreateForm", { message: "" }));

// Handle Folder create (POST)
exports.folder_create_post = [
    body("name")
        .trim()
        .isLength({min: 1, max: 30})
        .escape()
        .withMessage("Name for folder must be provided"),
    // Process request after validation and sanitisation
    asyncHandler(async(req, res, next) => {
        // Extract validation errors from a request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("folderCreateForm", { 
                message: errors.array().map(err => err.msg).join(", ") 
            })
        }
        try {
            const user_id = parseInt(req.params.id);
            const folderExists = await db.getFolderByName(req.body.name);
            if (folderExists) {
                return res.render("folderCreateForm", { message: "A folder with that name already exists" })
            }
            const newFolder = await db.createFolder({
                name: req.body.name,
                user_id: user_id,
                files: [],
            });
            res.redirect(`/uploads/folder/${newFolder.id}`)
        } catch (err) {
            renderErrorPage(res, err);
        }
    })
];

// Display Folder update form (GET)
exports.folder_update_get = asyncHandler(async(req, res, next) => {
    try {
        const folder = await db.getFolderByID(parseInt(req.params.id));
        res.render("folderUpdateForm", {
            folder,
            message: "",
        });
    } catch (err) {
        renderErrorPage(res, err);
    }
});

// Handle Folder update (POST)
exports.folder_update_post = [
    body("name")
        .trim()
        .isLength({min: 1, max: 30})
        .escape()
        .withMessage("Name for folder must be provided"),
    // Process request after validation and sanitisation
    asyncHandler(async(req, res, next) => {
        const folder = await db.getFolderByID(parseInt(req.params.id));
        // Extract validation errors from a request
        const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.render("folderUpdateForm", {
                    folder,
                    message: errors.array().map(err => err.msg).join(", "),
                })
            }
        try {
            const existingFolder = await db.getFolderByName(req.body.name);
            const folder_id = parseInt(req.params.id);
            if (existingFolder && existingFolder.id !== folder_id) {
                return res.render("folderUpdateForm", {
                    message: "A folder with that name already exists",
                })
            }
            await db.updateFolder({                
                id: folder_id,
                name: req.body.name,
            })
            res.redirect(`/uploads/folder/${folder_id}`);
        } catch (err) {
            renderErrorPage(res, err);
        }
    })
];

// Display Folder delete confirmation form (GET)
exports.folder_delete_get = asyncHandler(async(req, res, next) => {
    try {
        const folder = await db.getFolderByID(parseInt(req.params.id));
        res.render("folderDeleteForm", { folder });
    } catch (err) {
        renderErrorPage(res, err);
    }
});

// Handle Folder deletion (POST)
exports.folder_delete_post = asyncHandler(async(req, res, next) => {
    try {
        await db.deleteFolder(parseInt(req.params.id));
        res.render("folderDeleted");
    } catch (err) {
        renderErrorPage(res, err);
    }
});