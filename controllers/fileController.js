//const File = require("../models/file");
const asyncHandler = require("express-async-handler");

// List of all files for a user
exports.files_list = asyncHandler(async(req, res, next) => {
    res.send(`NOT IMPLEMENTED: Files List for User: ${req.params.id}`);
});

// Details of a single file
exports.file_detail = asyncHandler(async(req, res, next) => {
    res.send(`NOT IMPLEMENTED: File detail: ${req.params.id}`);
});

// GET File create form
exports.file_create_get = asyncHandler(async(req, res, next) => {
    res.send("NOT IMPLEMENTED: File create GET");
});

// Handle File create on POST
exports.file_create_post = asyncHandler(async(req, res, next) => {
    res.send("NOT IMPLEMENTED: File create POST");
});

// GET File update form
exports.file_update_get = asyncHandler(async(req, res, next) => {
    res.send("NOT IMPLEMENTED: File update GET");
});

// Handle File update on POST
exports.file_update_post = asyncHandler(async(req, res, next) => {
    res.send("NOT IMPLEMENTED: File update POST");
});

// GET File delete form
exports.file_delete_get = asyncHandler(async(req, res, next) => {
    res.send("NOT IMPLEMENTED: File delete GET");
});

// Handle File delete on POST
exports.file_delete_post = asyncHandler(async(req, res, next) => {
    res.send("NOT IMPLEMENTED: File delete POST");
});