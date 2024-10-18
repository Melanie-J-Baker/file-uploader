//const File = require("../models/file");
const asyncHandler = require("express-async-handler");

// List of all files for a folder
exports.files_list = asyncHandler(async(req, res, next) => {
    try {
        const files = await db.getAllFiles(req.params.id);
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
        const file = await db.getFile(req.params.id);
        res.json(file);
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
          });
    }
});

// GET File upload form
exports.file_create_get = asyncHandler(async(req, res, next) => {
    res.render("fileUploadForm", {
        folder_id: req.params.id
    });
});

// Handle File create on POST
exports.file_create_post = asyncHandler(async(req, res, next) => {
    try {
        const { file } = req.body;
        //req.body.file >>> CLOUDINARY!!
        //file.url =
        //file.size =
        file.upload_time = Date.now();
        file.folder_id = req.params.id;
        await db.createFile(file)
        res.json({ 
            message: `File uploaded: ${file.name}`,
            file: file
        });
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        });
    }
});

// GET File update form
exports.file_update_get = asyncHandler(async(req, res, next) => {
    res.render("fileUpdateForm", {
        file_id: req.params.id
    });
});

// Handle File update on POST
exports.file_update_post = asyncHandler(async(req, res, next) => {
    try {
        const { file } = req.body;
        if (req.body.file) {
            //req.body.file >>> CLOUDINARY!!
            //file.url =
            //file.size =
            file.upload_time = Date.now();
        }
        file.id = req.params.id;
        await db.updateFile(file)
        res.json({
            message: "File updated",
            file: file
        });
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        });
    }
});

// GET File delete form
exports.file_delete_get = asyncHandler(async(req, res, next) => {
    res.render("fileDeleteForm", {
        file_id: req.params.id
    });
});

// Handle File delete on POST
exports.file_delete_post = asyncHandler(async(req, res, next) => {
    try {
        const file_id = req.params.id;
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