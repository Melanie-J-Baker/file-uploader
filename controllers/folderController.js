//const Folder = require("../models/folder");
const asyncHandler = require("express-async-handler");

// List of all folders for a user
exports.folders_list = asyncHandler(async(req, res, next) => {    
    res.send(`NOT IMPLEMENTED: Folder List for User: ${req.params.id}`);
});

// Details of a single folder
exports.folder_detail = asyncHandler(async(req, res, next) => {
    res.send(`NOT IMPLEMENTED: Folder detail: ${req.params.id}`);
});

// GET Folder create form
exports.folder_create_get = asyncHandler(async(req, res, next) => {
    res.send("NOT IMPLEMENTED: Folder create GET");
});

// Handle Folder create on POST
exports.folder_create_post = asyncHandler(async(req, res, next) => {
    res.send("NOT IMPLEMENTED: Folder create POST");
});

// GET Folder update form
exports.folder_update_get = asyncHandler(async(req, res, next) => {
    res.send("NOT IMPLEMENTED: Folder update GET");
});

// Handle Folder update on POST
exports.folder_update_post = asyncHandler(async(req, res, next) => {
    res.send("NOT IMPLEMENTED: Folder update POST");
});

// GET Folder delete form
exports.folder_delete_get = asyncHandler(async(req, res, next) => {
    res.send("NOT IMPLEMENTED: Folder delete GET");
});

// Handle Folder delete on POST
exports.folder_delete_post = asyncHandler(async(req, res, next) => {
    res.send("NOT IMPLEMENTED: Folder delete POST");
});