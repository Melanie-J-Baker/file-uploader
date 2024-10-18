const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/userController");
const folder_controller = require("../controllers/folderController");
const file_controller = require("../controllers/fileController");

// USER ROUTES

// GET Welcome Page
router.get("/", user_controller.index);

// List of all users
router.get("/users", user_controller.user_list);

// Details of a single user
router.get("/user/:id", user_controller.user_detail);

// GET User create form
router.get("/user/create", user_controller.user_create_get);

// Handle User create on POST
router.post("/user/create", user_controller.user_create_post);

// GET Login form
router.get('user/login', user_controller.user_login_get);

// Handle User login on POST
router.post('user/login', user_controller.user_login_post);

// GET User update form
router.get("/user/:id/update", user_controller.user_update_get);

// Handle User update on POST
router.post("/user/:id/update", user_controller.user_update_post);

// GET User delete form
router.get("/user/:id/delete", user_controller.user_delete_get);

// Handle User delete on POST
router.post("/user/:id/delete", user_controller.user_delete_post);

// FOLDER ROUTES

// List of all folders for a user
router.get("/user/:id/folders", folder_controller.folders_list);

// Details of a single folder
router.get("/folder/:id", folder_controller.folder_detail);

// GET Folder create form
router.get("/user/:id/folder/create", folder_controller.folder_create_get);

// Handle Folder create on POST
router.post("/folder/create", folder_controller.folder_create_post);

// GET Folder update form
router.get("/folder/:id/update", folder_controller.folder_update_get);

// Handle Folder update on POST
router.post("/folder/:id/update", folder_controller.folder_update_post);

// GET Folder delete form
router.get("/folder/:id/delete", folder_controller.folder_delete_get);

// Handle Folder delete on POST
router.post("/folder/:id/delete", folder_controller.folder_delete_post);

// FILE ROUTES

// List of all files for a user
router.get("/user/:id/files", file_controller.files_list);

// Details of a single file
router.get("/file/:id", file_controller.file_detail);

// GET File create form
router.get("/file/create", file_controller.file_create_get);

// Handle File create on POST
router.post("/file/create", file_controller.file_create_post);

// GET File update form
router.get("/file/:id/update", file_controller.file_update_get);

// Handle File update on POST
router.post("/file/:id/update", file_controller.file_update_post);

// GET File delete form
router.get("/file/:id/delete", file_controller.file_delete_get);

// Handle File delete on POST
router.post("/file/:id/delete", file_controller.file_delete_post);

module.exports = router;