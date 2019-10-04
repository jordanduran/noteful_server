const noteService = {
    getAllNotes(db) {
        return db.select('*').from('notes');
    },

    addNote(db, newNote) {
        return db
            .insert(newNote)
            .into('notes')
            .returning('*')
            .then(rows => rows[0]);
    },
    deleteNote(db, id) {
        return db('notes')
            .where({ id })
            .delete();
    },
    updateNote(db, id, newNote) {
        return db('notes')
            .where({ id })
            .update(newNote)
            .first();
    },
    getNotesById(db, id){
        return db
            .select('*')
            .from('notes')
            .where('id', id)
            .first();
    },
};

module.exports = noteService;