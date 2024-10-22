const db = require("../db/queries");
const asyncHandler = require("express-async-handler");

// List of all folders for a user
exports.folders_list = asyncHandler(async(req, res, next) => {    
    try {
        const user_id = parseInt(req.params.id);
        const folders = await db.getAllFolders(user_id);
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
        const folder_id = parseInt(req.params.id);
        const folder = await db.getFolderByID(folder_id);
        res.render("folderDetails", {
            folder: folder,
        });
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
          });
    }
});

// GET Folder create form
exports.folder_create_get = asyncHandler(async(req, res, next) => {
    const user_id = parseInt(req.params.id);
    res.render("folderCreateForm", {
        user_id: user_id,
        message: "",
    });
});

// Handle Folder create on POST
exports.folder_create_post = asyncHandler(async(req, res, next) => {
    try {
        const user_id = parseInt(req.params.id);
        const folderExists = await db.getFolderByName(req.body.name);
        if (!folderExists) {
            const folder = {
                name: req.body.name,
                user_id: user_id,
            }
            const newFolder = await db.createFolder(folder);
            res.redirect(`/uploads/folder/${newFolder.id}`)
        } else {
            return res.render("folderCreateForm", {
                message: "A folder with that name already exists"
            })
        }
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        });
    }
});

// GET Folder update form
exports.folder_update_get = asyncHandler(async(req, res, next) => {
    try {
        const folder_id = parseInt(req.params.id);
        const folder = await db.getFolderByID(folder_id);
        res.render("folderUpdateForm", {
            folder: folder
        });
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        });
    }
});

// Handle Folder update on POST
exports.folder_update_post = asyncHandler(async(req, res, next) => {
    try {
        const folder_id = parseInt(req.params.id);
        const folderExists = await db.getFolderByName(req.body.name);
        if (folderExists && folderExists.id !== req.folder_id) {
            return res.render("folderUpdateForm", {
                message: "A folder with that name already exists"
            })
        } else {
            const { folder } = req.body;
            folder.id = folder_id;
            await db.updateFolder(folder)
            res.redirect(`/uploads/folder/${folder_id}`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        });
    }
});

// GET Folder delete form
exports.folder_delete_get = asyncHandler(async(req, res, next) => {
    try {
        const folder_id = parseInt(req.params.id);
        const folder = await db.getFolderByID(folder_id);
        res.render("folderDeleteForm", {
            folder: folder
        });
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        });
    }
});

// Handle Folder delete on POST
exports.folder_delete_post = asyncHandler(async(req, res, next) => {
    try {
        const folder_id = parseInt(req.params.id);
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