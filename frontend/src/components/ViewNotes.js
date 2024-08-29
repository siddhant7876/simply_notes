// src/components/ViewNotes.js
import React from 'react';
import CreateNoteForm from './CreateNoteForm';


const ViewNotes = ({ notes, directoryId, handleViewNotePage, handleDeleteNote, handleCreateNote }) => {
    console.log("ViewNotes.js: directoryId: ", directoryId);
    return (
        <div>
            <h2>Notes</h2>
            {/* Form to create a new note */}
            <CreateNoteForm directoryId={directoryId} handleCreateNote={handleCreateNote} />
            {/* List of notes */}
            <ul>
                {notes.map((note) => (
                    <li key={note.id}>
                        <span onClick={() => handleViewNotePage(note.id)}>{note.title}</span>
                        <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewNotes;
