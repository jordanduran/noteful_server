const FOLDERS_TABLE = 'folders';
const folderServices = { // CRUD OPERATIONS
    getAllFolders(db){ // READ
        return db
            .select('*')
            .from(FOLDERS_TABLE);
    },
    addNewFolder(db, newFolder){ // CREATE
        return db
            .insert(newFolder)
            .into(FOLDERS_TABLE)
            .returning('*')
            .then((rows) => rows[0]);
    },
    deleteFolder(db, id){ // DELETE
        return db(FOLDERS_TABLE)
            .where({ id })
            .delete();
    },
    updateFolder(db, id, newFields){ // UPDATE
        return db(FOLDERS_TABLE)
            .where({ id })
            .update(newFields)
            .first();
    }
}

module.exports = folderServices;