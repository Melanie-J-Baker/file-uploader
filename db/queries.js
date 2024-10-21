const pool = require("./pool");

async function getAllUsers() {
    const { rows } = await pool.query("SELECT id, username FROM users;");
    return rows;
}

async function getUser(id) {
    const { rows } = await pool.query("SELECT id, username FROM users WHERE id = $1", [id]);
    return rows[0];
} 

async function createUser(user) {
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [user.username, user.password]);
    const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [user.username]);
    return rows[0];
}

async function updateUser(user) {
    user.username && await pool.query("UPDATE users SET username=$1 WHERE id = $2;", [user.username, user.id]);
    user.password && await pool.query("UPDATE users SET password=$1 WHERE id = $2;", [user.password, user.id]); 
    const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [user.username]);
    return rows[0];
}

async function deleteUser(id) {
    await pool.query("DELETE FROM users WHERE id = $1;", [id]);
}


async function getAllFolders(id) {
    const { rows } = await pool.query("SELECT * FROM folders WHERE user_id = $1;", [id]);
    return rows;
}

async function getFolder(id) {
    const { rows } = await pool.query("SELECT * FROM folders WHERE id = $1;", [id]);
    return rows[0];
} 

async function createFolder(folder) {
    await pool.query("INSERT INTO folders (name, user_id) VALUES ($1, $2)", [folder.name, folder.user_id]);
    const { rows } = await pool.query("SELECT * FROM folders WHERE name = $1", [folder.name]);
    return rows[0];
}

async function updateFolder(folder) {
    folder.name && await pool.query("UPDATE folders SET name=$1 WHERE id = $2;", [folder.name, folder.id]);
}

async function deleteFolder(id) {
    await pool.query("DELETE FROM folders WHERE id = $1;", [id]);
}

async function getAllFiles(id) {
    const { rows } = await pool.query("SELECT * FROM files JOIN folders ON files.folder_id = folders.id WHERE folders.user_id = $1;", [id]);
    return rows;
}

async function getFile(id) {
    const { rows } = await pool.query("SELECT * FROM files WHERE id = $1;", [id]);
    return rows[0];
} 

async function createFile(file) {
    await pool.query("INSERT INTO files (name, url, size_mb, upload_time, folder_id) VALUES ($1, $2, $3, $4, $5)", [file.name, file.url, file.size_mb, file.upload_time, file.folder_id]);
    const { rows } = await pool.query("SELECT * FROM files WHERE name = $1", [file.name]);
    return rows[0];
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