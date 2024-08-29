// src/components/DirectoryForm.js
import React, { useState } from 'react';

const DirectoryForm = ({ handleCreateDirectory }) => {
    const [directoryName, setDirectoryName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const directoryName = e.target.elements['directory-name'].value;
        // Call the handleCreateDirectory function passed via props
        handleCreateDirectory(directoryName);
        // Optionally, reset the form field
        setDirectoryName('');
    };

    return (
        <div>
            <h2>Create Directory</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="directory-name"
                    placeholder="Directory Name"
                    value={directoryName}
                    onChange={(e) => setDirectoryName(e.target.value)}
                    required
                />
                <button type="submit">Create Directory</button>
            </form>
        </div>
    );
};

export default DirectoryForm;
