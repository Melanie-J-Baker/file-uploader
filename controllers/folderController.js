const db = require("../db/queries");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
require("../helpers/renderErrorPage");

// List of all folders for a user
exports.folders_list = asyncHandler(async(req, res, next) => {    
    try {
        const user_id = parseInt(req.params.id);
        const folders = await db.getAllFolders(user_id);
        console.log("Folders: ", folders);
        res.json(folders);
    } catch (err) {
        renderErrorPage(res, err);
    }
});

// Details of a single folder
exports.folder_detail = asyncHandler(async(req, res, next) => {
    try {
        const folder_id = parseInt(req.params.id);
        const folder = await db.getFolderByID(folder_id);
        res.render("folderDetails", {
            folder: folder,
            files: folder.files,
        });
    } catch (err) {
        renderErrorPage(res, err);
    }
});

// GET Folder create form
exports.folder_create_get = asyncHandler(async(req, res, next) => {
    res.render("folderCreateForm", {
        message: "",
    });
});

// Handle Folder create on POST
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
            const errorsString = errors.array().toString();
            res.render("folderCreateForm", {
                message: errorsString,
            })
        }
        try {
            const user_id = parseInt(req.params.id);
            const folderExists = await db.getFolderByName(req.body.name);
            if (!folderExists) {
                const folder = {
                    name: req.body.name,
                    user_id: user_id,
                    files: [],
                }
                const newFolder = await db.createFolder(folder);
                res.redirect(`/uploads/folder/${newFolder.id}`)
            } else {
                return res.render("folderCreateForm", {
                    message: "A folder with that name already exists",
                })
            }
        } catch (err) {
            renderErrorPage(res, err);
        }
    })
];

// GET Folder update form
exports.folder_update_get = asyncHandler(async(req, res, next) => {
    try {
        const folder_id = parseInt(req.params.id);
        const folder = await db.getFolderByID(folder_id);
        res.render("folderUpdateForm", {
            folder: folder,
            message: "",
        });
    } catch (err) {
        renderErrorPage(res, err);
    }
});

// Handle Folder update on POST
exports.folder_update_post = [
    body("name")
        .trim()
        .isLength({min: 1, max: 30})
        .escape()
        .withMessage("Name for folder must be provided"),
    // Process request after validation and sanitisation
    asyncHandler(async(req, res, next) => {
        try {
            const folder_id = parseInt(req.params.id);
            const folder = await db.getFolderByID(folder_id);
            const folderExists = await db.getFolderByName(req.body.name);
            // Extract validation errors from a request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorsString = errors.array().toString();
                res.render("folderUpdateForm", {
                    folder: folder,
                    message: errorsString,
                })
            }
            if (folderExists && folderExists.id !== req.folder_id) {
                return res.render("folderUpdateForm", {
                    message: "A folder with that name already exists",
                })
            } else {
                const newFolder = {
                    name: req.body.name,
                    id: folder_id,
                };
                await db.updateFolder(newFolder)
                res.redirect(`/uploads/folder/${folder_id}`);
            }
        } catch (err) {
            renderErrorPage(res, err);
        }
    })
];

// GET Folder delete form
exports.folder_delete_get = asyncHandler(async(req, res, next) => {
    try {
        const folder_id = parseInt(req.params.id);
        const folder = await db.getFolderByID(folder_id);
        res.render("folderDeleteForm", {
            folder: folder,
        });
    } catch (err) {
        renderErrorPage(res, err);
    }
});

// Handle Folder delete on POST
exports.folder_delete_post = asyncHandler(async(req, res, next) => {
    try {
        const folder_id = parseInt(req.params.id);
        await db.deleteFolder(folder_id);
        res.render("folderDeleted");
    } catch (err) {
        renderErrorPage(res, err);
    }
});