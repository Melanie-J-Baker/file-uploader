const db = require("../db/queries");
const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

// Handle file upload
async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
    });
    return res;
}

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
        const file = await db.getFileByID(file_id);
        const folder = await db.getFolderByID(file.folder_id);
        const user_id = folder.user_id;
        res.render("fileDetails", {
            file: file,
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
            folders: folders,
            message: "",
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
        const filenameExists = await db.getFileByName(req.file.originalname);
        if (!filenameExists) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const cldRes = await handleUpload(dataURI);
            const file = {
                name: req.file.originalname,
                url: cldRes.secure_url,
                size_mb: req.file.size / 1000000,
                upload_time: new Date(Date.now()),
                folder_id: parseInt(req.body.folder_id),
            };
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
        const file = await db.getFileByID(file_id);
        const folder = await db.getFolderByID(file.folder_id);
        const user = await db.getUserByID(folder.user_id);
        res.render("fileUpdateForm", {
            file: file,
            folders: user.folders,
            message: "",
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
        const oldFile = getFileByID(file_id);
        const folder = await db.getFolderByID(file.folder_id);
        const user = await db.getUserByID(folder.user_id);
        if (req.body.folder_id) {
            const file = {
                id: file_id,
                folder_id: req.body.folder_id,
            };
            const newFile = await db.updateFile(file);
            res.redirect(`/uploads/file/${newFile.id}`);
        } else {
            res.render('fileUpdateForm', {
                file: oldFile,
                folders: user.folders,
                message: "Folder must be provided",
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
        const file = await db.getFileByID(file_id);
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
        res.render("fileDeleted");
    } catch (err) {
        console.error(err);
        res.status(500).render("error", {
            error: err,
        });
    }
});