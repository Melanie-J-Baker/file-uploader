const pool = require("./pool");

async function getAllUsers() {
    const { rows } = await pool.query("SELECT username FROM users;");
    return rows;
}

async function getUser(id) {
    const { user } = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    return user;
} 

async function createUser(user) {
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [user.username, user.password]);
}

async function updateUser(user) {
    user.username && await pool.query("UPDATE users SET username=$1 WHERE user_id=$2;", [user.username, user.id]);
    user.password && await pool.query("UPDATE users SET password=$1 WHERE user_id=$2;", [user.password, user.id]); 
}

async function deleteUser(id) {
    await pool.query("DELETE FROM users WHERE user_id = $1;", [id]);
}


async function getAllFolders(id) {
    const { rows } = await pool.query("SELECT id, name FROM folders WHERE user_id=$1;", [id]);
    return rows;
     //SELECT user.id, folders.name
    //FROM users user
    //LEFT JOIN folders ON user.id = folders.user_id;
}

async function getFolder(id) {
    const { folder } = await pool.query("SELECT * FROM folders WHERE id = $1;", [id]);
    return folder;
} 

async function createFolder(folder) {
    await pool.query("INSERT INTO folders (name, user_id) VALUES ($1, $2)", [folder.name, folder.user_id]);
}

async function updateFolder(folder) {
    folder.name && await pool.query("UPDATE folders SET name=$1 WHERE id=$2;", [folder.name, folder.id]);
}

async function deleteFolder(id) {
    await pool.query("DELETE FROM folders WHERE id = $1;", [id]);
}

async function getAllFiles(id) {
    const folders  = await pool.query("SELECT id FROM folders WHERE user_id=$1;", [id]);
    const { rows } = await pool.query("SELECT * FROM files WHERE folder_id=ANY($1);", [folders]);
    return rows;
    
}

async function getFile(id) {
    const { file } = await pool.query("SELECT * FROM files WHERE id = $1;", [id]);
    return file;
} 

async function createFile(file) {
    await pool.query("INSERT INTO files (name, url, size_mb, upload_time, folder_id) VALUES ($1, $2, $3, $4, $5)", [file.name, file.url, file.size_mb, file.upload_time, file.folder_id]);
}

async function updateFile(file) {
    file.name && await pool.query("UPDATE files SET name=$1 WHERE id=$2;", [file.name, file.id]);
    file.url  && await pool.query("UPDATE files SET url=$1 WHERE id=$2;", [file.url, file.id]);
    file.size_mb  && await pool.query("UPDATE files SET size_mb=$1 WHERE id=$2;", [file.size_mb, file.id]);
    file.upload_time  && await pool.query("UPDATE files SET upload_time=$1 WHERE id=$2;", [file.upload_time, file.id]);
    file.folder_id  && await pool.query("UPDATE files SET folder_id=$1 WHERE id=$2;", [file.folder_id, file.id]);
}

async function deleteFile(id) {
    await pool.query("DELETE FROM files WHERE id = $1;", [id]);
}

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getAllFolders,
    getFolder,
    createFolder,
    updateFolder,
    deleteFolder,
    getAllFiles,
    getFile,
    createFile,
    updateFile,
    deleteFile,
}