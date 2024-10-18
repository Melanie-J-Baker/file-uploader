//const Folder = require("../models/folder");
const asyncHandler = require("express-async-handler");

// List of all folders for a user
exports.folders_list = asyncHandler(async(req, res, next) => {    
    try {
        const folders = await db.getAllFolders(req.params.id);
        console.log("Folders: ", folders);
        res.json(folders);
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        })
    }
});

// Details of a single folder
exports.folder_detail = asyncHandler(async(req, res, next) => {
    try {
        const folder = await db.getFolder(req.params.id);
        res.json(folder);
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
          });
    }
});

// GET Folder create form
exports.folder_create_get = asyncHandler(async(req, res, next) => {
    res.render("folderCreateForm", {
        user_id: req.params.id
    });
});

// Handle Folder create on POST
exports.folder_create_post = asyncHandler(async(req, res, next) => {
    try {
        const { folder } = req.body;
        folder.user_id = req.params.id;
        await db.createFolder(folder)
        res.json({message: `Folder created: ${folder.name}`});
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        });
    }
});

// GET Folder update form
exports.folder_update_get = asyncHandler(async(req, res, next) => {
    const folder = req.params.id;
    res.render("folderUpdateForm", {
        folder: folder
    });
});

// Handle Folder update on POST
exports.folder_update_post = asyncHandler(async(req, res, next) => {
    try {
        const { folder } = req.body;
        folder.id = req.params.id;
        await db.updateFolder(folder)
        res.json({
            message: "Folder updated",
            folder: folder
        });
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        });
    }
});

// GET Folder delete form
exports.folder_delete_get = asyncHandler(async(req, res, next) => {
    const folder = req.params.id;
    res.render("folderDeleteForm", {
        folder: folder
    });
});

// Handle Folder delete on POST
exports.folder_delete_post = asyncHandler(async(req, res, next) => {
    try {
        const folder_id = req.params.id;
        await db.deleteFolder(folder_id);
        res.json({
            message: "Folder deleted",
            folder_id: folder_id
        });
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        });
    }
});