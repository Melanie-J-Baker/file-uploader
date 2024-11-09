const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

async function getAllUsers() {
    const users = await prisma.users.findMany({
        include: {
            folders: true,
        },
    });
    return users;
}

async function getUserByID(id) {
    const user = await prisma.users.findUnique({
        include: {
            folders: true,
        },
        where: {
            id: id,
        },
    });
    return user;
}

async function getUserByUsername(username) {
    const user = await prisma.users.findMany({
        where: {
            username: username,
        },
    });
    return user[0];
}

async function createUser(user) {
    const newUser = await prisma.users.create({
        data: {
            username: user.username,
            password: user.password,
        },
    });
    return newUser;
}

async function updateUser(user) {
    const data = user.username && user.password ? { username: user.username, password: user.password } : user.username ? { username: user.username } : { password: user.password }; 
    const updatedUser = await prisma.users.update({
        where: { id: user.id },
        data: data,
    });
    return updatedUser;
}

async function deleteUser(id) {
    // Find all folders created by user
    const allFolders = await prisma.folders.findMany({
        where: {
            user_id: id,
        },
    });
    // Delete all files in folders created by user
    allFolders.map(async(folder) => {
        await prisma.files.deleteMany({
            where: {
                folder_id: folder.id
            }
        });
    });
    // Delete all folders created by user
    await prisma.folders.deleteMany({
        where: {
            user_id: id,
        },
    });
    // Delete user
    await prisma.users.delete({
        where: {
            id: id,
        },
    });

}

async function getAllFolders(id) {
    const folders = await prisma.folders.findMany({
        include: { 
            files: true,
        },
        where: {
            user_id: id,
        },
    });
    return folders;
}

async function getFolderByID(id) {
    const folder = await prisma.folders.findUnique({
        include: {
            files: true,
        },
        where: {
            id: id,
        },
    });
    return folder;
}

async function getFolderByName(name) {
    const folders = await prisma.folders.findMany({
        include: {
            files: true,
        },
        where: {
            name: name,
        },
    });
    return folders[0];
}

async function createFolder(folder) {
    const newFolder = await prisma.folders.create({
        data: {
            name: folder.name,
            user_id: folder.user_id,
        },
    });
    return newFolder;
}

async function updateFolder(folder) {
    const updatedFolder = await prisma.folders.update({
        where: { 
            id: folder.id,
        },
        data: { 
            name: folder.name,
        },
    });
    return updatedFolder;
}

async function deleteFolder(id) {
    // Delete all files in folders
    await prisma.files.deleteMany({
        where: { 
            folder_id: id,
        },
    });
    // Delete folders
    await prisma.folders.delete({
        where: { 
            id: id,
        },
    });
}

async function getAllFilesInFolder(id) {
    const files = await prisma.files.findMany({
        where: {
            folder_id: id,
        },
    });
    return files;
}

async function getFileByID(id) {
    const file = await prisma.files.findUnique({
        where: {
            id: id,
        },
    });
    return file;
}

async function getFileByName(name) {
    const files = await prisma.files.findMany({
        where: {
            name: name,
        },
    });
    return files[0];
}

async function createFile(file) {
    const newFile = await prisma.files.create({
        data: {
            name: file.name,
            url: file.url,
            size: file.size,
            upload_time: file.upload_time,
            folder: { connect: { id: file.folder_id }},
        },
    });
    return newFile;
}

async function updateFile(file) {
    const updatedFile = await prisma.files.update({
        where: {
            id: file.id, 
        },
        data: file,
    });
    return updatedFile;
}

async function deleteFile(id) {
    await prisma.files.delete({
        where: { 
            id: id,
        },
    });
}

module.exports = {
    getAllUsers,
    getUserByID,
    getUserByUsername,
    createUser,
    updateUser,
    deleteUser,
    getAllFolders,
    getFolderByID,
    getFolderByName,
    createFolder,
    updateFolder,
    deleteFolder,
    getAllFilesInFolder,
    getFileByID,
    getFileByName,
    createFile,
    updateFile,
    deleteFile,
}