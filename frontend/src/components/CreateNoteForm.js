import React, { useState } from 'react';

const CreateNoteForm = ({ directoryId, handleCreateNote }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("CreateNoteForm.js: directoryId: ", directoryId, "title: ", title);
        handleCreateNote(directoryId, title);
        setTitle('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Create Note</button>
        </form>
    );
};

export default CreateNoteForm;