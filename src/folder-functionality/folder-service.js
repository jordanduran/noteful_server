const FOLDERS_TABLE = 'folders';
const NOTES_TABLE = 'notes';
const folderServices = { // CRUD OPERATIONS
    getAllFolders(db){ // READ
        return db
            .select('*')
            .from('folders');
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
    },
    getAllNotesByFolderId(db, folder_id){
        return db(NOTES_TABLE)
            .where({ folder_id });
    }
}

module.exports = folderServices;