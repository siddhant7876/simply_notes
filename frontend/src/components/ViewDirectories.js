// src/components/ViewDirectories.js
import React from 'react';

const ViewDirectories = ({ directories, handleViewDirectory, handleDeleteDirectory }) => {
    console.log("ViewDirectories.js: directories: ", directories);
    return (
        <div>
            <h2>Directories</h2>
            <ul>
                {directories.map((directory) => (
                    <li key={directory.id}>
                        <span onClick={() => handleViewDirectory(directory.id)}>{directory.name}</span>
                        <button onClick={() => handleDeleteDirectory(directory.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewDirectories;
