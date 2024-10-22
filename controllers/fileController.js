const db = require("../db/queries");
const asyncHandler = require("express-async-handler");

// List of all files for a folder
exports.files_list = asyncHandler(async(req, res, next) => {
    try {
        const folder_id = parseInt(req.params.id);
        const files = await db.getAllFilesInFolder(folder_id);
        console.log("Files: ", files);
        res.json(files);
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        })
    }
});

// Details of a single file
exports.file_detail = asyncHandler(async(req, res, next) => {
    try {
        const file_id = parseInt(req.params.id);
        const file = await db.getFile(file_id);
        const folder = await db.getFolderByID(file.folder_id);
        const user_id = folder.user_id;
        res.render("fileDetails", {
            file: file,
            user_id: user_id

        });
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
          });
    }
});

// GET File upload form
exports.file_create_get = asyncHandler(async(req, res, next) => {
    try {
        const user_id = parseInt(req.params.id);
        const folders = await db.getAllFolders(user_id);
        res.render("fileUploadForm", {
            user: user_id,
            folders: folders
        });
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        });
    }

});

// Handle File create on POST
exports.file_create_post = asyncHandler(async(req, res, next) => {
    try {
        const folder_id = parseInt(req.params.id);
        const filenameExists = await db.getFile({name: req.body.name});
        if (!filenameExists) {
            const { file } = req.body;
            //req.body.file >>> CLOUDINARY!!
            //file.url =
            //file.size =
            file.upload_time = Date.now();
            file.folder_id = folder_id;
            const newFile = await db.createFile(file);
            res.redirect(`/uploads/file/${newFile.id}`);
        } else {
            res.render("fileUploadForm", {
                message: "That filename is already in use",
            })
        }
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        });
    }
});

// GET File update form
exports.file_update_get = asyncHandler(async(req, res, next) => {
    try {
        const file_id = parseInt(req.params.id);
        const file = await db.getFile(file_id);
        res.render("fileUpdateForm", {
            file: file,
        });
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        });
    }
});

// Handle File update on POST
exports.file_update_post = asyncHandler(async(req, res, next) => {
    try {
        const file_id = parseInt(req.params.id);
        const filenameExists = await db.getFile({name: req.body.name});
        if (!filenameExists) {
            const { file } = req.body;
            if (req.body.file) {
                //req.body.file >>> CLOUDINARY!!
                //file.url =
                //file.size =
                file.upload_time = Date.now();
            }
            file.id = file_id;
            await db.updateFile(file)
            res.redirect(`/uploads/file/${file_id}`);
        } else {
            res.render("fileUpdateForm", {
                message: "File name already in use",
            })
        }
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        });
    }
});

// GET File delete form
exports.file_delete_get = asyncHandler(async(req, res, next) => {
    try {
        const file_id = parseInt(req.params.id);
        const file = await db.getFile(file_id);
        res.render("fileDeleteForm", {
            file: file,
        });
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        });
    }
});

// Handle File delete on POST
exports.file_delete_post = asyncHandler(async(req, res, next) => {
    try {
        const file_id = parseInt(req.params.id);
        await db.deleteFile(file_id);
        res.json({
            message: "File deleted",
            file_id: file_id
        });
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        });
    }
});