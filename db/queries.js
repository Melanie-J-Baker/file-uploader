const pool = require("./pool");

async function getAllUsers() {
    const { rows } = await pool.query("SELECT username FROM users;");
    return rows;
}

async function getUser(id) {
    const { user } = await pool.query(`SELECT * FROM users WHERE user_id = ${id};`);
    return user;
} 

async function createUser(user) {
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [user.username, user.password]);
}

async function updateUser(user) {
    // SHOULD THIS BE VALUES ($1, $2)??
    username && await pool.query(`UPDATE users SET username=${user.username} WHERE user_id=${user.id};`);
    password && await pool.query(`UPDATE users SET password=${user.password} WHERE user_id=${user.id};`); 
}

async function deleteUser(id) {
    await pool.query(`DELETE FROM users WHERE user_id = ${id};`)
}


async function getAllFolders(id) {
    const { rows } = await pool.query(`SELECT id, name FROM folders WHERE user_id=${id};`);
    return rows;
     //SELECT user.id, folders.name
    //FROM users user
    //LEFT JOIN folders ON user.id = folders.user_id;
}

async function getFolder(id) {
    const { folder } = await pool.query(`SELECT * FROM folders WHERE id = ${id};`);
    return folder;
} 

async function createFolder(folder) {
    await pool.query("INSERT INTO folders (name, user_id) VALUES ($1, $2)", [folder.name, folder.user_id]);
}

async function updateFolder(id, name) {
    // SHOULD THIS BE VALUES ($1, $2)??
    await pool.query(`UPDATE folders SET name=${name} WHERE id=${id};`);
}

async function deleteFolder(id) {
    await pool.query(`DELETE FROM folders WHERE id = ${id};`);
}

async function getAllFiles(id) {
    const folders  = await pool.query(`SELECT id FROM folders WHERE user_id=${id};`);
    const { rows } = await pool.query(`SELECT * FROM files WHERE folder_id=ANY(${folders});`);
    return rows;
    
}

async function getFile(id) {
    const { file } = await pool.query(`SELECT * FROM files WHERE id = ${id};`);
    return file;
} 

async function createFile(name, url, size_mb, upload_time, folder_id) {
    await pool.query("INSERT INTO files (name, url, size_mb, upload_time, folder_id) VALUES ($1, $2, $3, $4, $5)", [name, url, size_mb, upload_time, folder_id]);
}

async function updateFile(id, name, url, size_mb, upload_time, folder_id) {
    // SHOULD THIS BE VALUES ($1, $2)??
    name && await pool.query(`UPDATE files SET name=${name} WHERE id=${id};`);
    url  && await pool.query(`UPDATE files SET url=${url} WHERE id=${id};`);
    size_mb  && await pool.query(`UPDATE files SET size_mb=${size_mb} WHERE id=${id};`);
    upload_time  && await pool.query(`UPDATE files SET upload_time=${upload_time} WHERE id=${id};`);
    folder_id  && await pool.query(`UPDATE files SET folder_id=${folder_id} WHERE id=${id};`);
}

async function deleteFile(id) {
    await pool.query(`DELETE FROM files WHERE id = ${id};`);
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