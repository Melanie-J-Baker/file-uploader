const db = require("../db/queries");
const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2
const { extractPublicId } = require('cloudinary-build-url');
const renderErrorPage = require("../helpers/renderErrorPage");
const isFileImage = require("../helpers/isFileImage.js");
const formatBytes = require("../helpers/formatBytes.js");

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

// List of all files for a folder (GET)
exports.files_list = asyncHandler(async(req, res, next) => {
    try {
        const files = await db.getAllFilesInFolder(parseInt(req.params.id));
        res.json(files);
    } catch (err) {
        renderErrorPage(res, err);
    }
});

// Display details of a single file (GET)
exports.file_detail = asyncHandler(async(req, res, next) => {
    try {
        const file = await db.getFileByID(parseInt(req.params.id));
        const folder = await db.getFolderByID(file.folder_id);
        const url = `${process.env.PUBLIC_URL}/uploads/file/${parseInt(req.params.id)}/download`;
        const isImage = isFileImage(url);
        res.render("fileDetails", { file, folder, url, isImage });
    } catch (err) {
        renderErrorPage(res, err);
    }
});

// Display file upload form (GET)
exports.file_create_get = asyncHandler(async(req, res, next) => {
    try {
        const folders = await db.getAllFolders(parseInt(req.params.id));
        res.render("fileUploadForm", {
            folders,
            message: "",
        });
    } catch (err) {
        renderErrorPage(res, err);
    }

});

// Handle File create (POST)
exports.file_create_post = asyncHandler(async(req, res, next) => {
    try {
        const folders = await db.getAllFolders(parseInt(req.params.id));
        const existingFile = await db.getFileByName(req.file.originalname);
        if (existingFile) {
            return res.render("fileUploadForm", {
                folders,
                message: "That filename is already in use",
            })
        } else {
            const dataURI = `data:${req.file.mimetype};base64,${Buffer.from(req.file.buffer).toString("base64")}`;
            const cldRes = await handleUpload(dataURI);
            const formattedSize = formatBytes(req.file.size);
            const file = await db.createFile({
                name: req.file.originalname,
                url: cldRes.secure_url,
                size: formattedSize,
                upload_time: new Date(Date.now()),
                folder_id: parseInt(req.body.folder_id),
            });
            res.redirect(`/uploads/file/${file.id}`);
        }
    } catch (err) {
        renderErrorPage(res, err);
    }
});

// Display file update form (GET)
exports.file_update_get = asyncHandler(async(req, res, next) => {
    try {
        const file = await db.getFileByID(parseInt(req.params.id));
        const folder = await db.getFolderByID(file.folder_id);
        const user = await db.getUserByID(folder.user_id);
        res.render("fileUpdateForm", {
            file,
            folders: user.folders,
            message: "",
        });
    } catch (err) {
        renderErrorPage(res, err);
    }
});

// Handle File update (POST)
exports.file_update_post = asyncHandler(async(req, res, next) => {
    try {
        const folder_id = parseInt(req.body.folder_id);
        const file = { id: parseInt(req.params.id), folder_id};
        if (!folder_id) {
            const oldFile = await db.getFileByID(parseInt(req.params.id));
            const user = await db.getUserByID(oldFile.user_id);
            return res.render('fileUpdateForm', {
                file: oldFile,
                folders: user.folders,
                message: "Folder is required",
            })
        }
        await db.updateFile(file);
        res.redirect(`/uploads/file/${file.id}`);
    } catch (err) {
        renderErrorPage(res, err);
    }
});

// Display file delete confirmation form (GET)
exports.file_delete_get = asyncHandler(async(req, res, next) => {
    try {
        const file = await db.getFileByID(parseInt(req.params.id));
        res.render("fileDeleteForm", { file });
    } catch (err) {
        renderErrorPage(res, err);
    }
});

// Handle File delete (POST)
exports.file_delete_post = asyncHandler(async(req, res, next) => {
    try {
        await db.deleteFile(parseInt(req.params.id));
        res.render("fileDeleted");
    } catch (err) {
        renderErrorPage(res, err);
    }
});

// Download file (GET)
exports.file_download_get = asyncHandler(async(req, res, next) => {
    try {
        const file = await db.getFileByID(parseInt(req.params.id));
        const public_id = extractPublicId(file.url);
        const cloudData = await cloudinary.search
            .expression(`public_id=${public_id}`)
            .execute();
        res.status(200).render("downloadFile", { data: cloudData, file });
    } catch (err) {
        renderErrorPage(res, err);
    }
});