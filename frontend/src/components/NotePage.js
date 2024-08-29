// // src/components/NotePage.js
// import React, { useState } from 'react';
// import config from '../config';
// const NotePage = ({ noteId, images, handleImageUpload, handleImageDelete }) => {
//     const [file, setFile] = useState(null);
//     console.log("NotePage Images",images);
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (file) {
//             handleImageUpload(noteId, file);
//             setFile(null); // Reset the file input after upload
//             e.target.reset();
//         }
//     };

//     return (
//         <div>
//             <h2>Note Page</h2>
//             <form onSubmit={handleSubmit}>
//                 <input 
//                     type="file" 
//                     onChange={(e) => setFile(e.target.files[0])} 
//                     required 
//                 />
//                 <button type="submit">Upload Image</button>
//             </form>
//             <div>
//                 {images.map((image) => (                        
//                     <div key={image.id}>
//                         <img 
//                             src={`${config.baseURL}/images/uploads/${image.filename}`} 
//                             alt={image.filename} 
//                             style={{ width: '200px' }} 
//                         />
//                         <button onClick={() => handleImageDelete(noteId, image.id)}>Delete</button>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default NotePage;


import React, { useState } from 'react';
import config from '../config';

const NotePage = ({ noteId, images, handleImageUpload, handleImageDelete }) => {
    const [file, setFile] = useState(null);
    console.log("NotePage Images", images);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (file) {
            handleImageUpload(noteId, file);
            setFile(null); // Reset the file input after upload
            e.target.reset(); // Reset the form to clear the file input
        }
    };

    const renderFile = (file) => {
        const fileExtension = file.filename.split('.').pop().toLowerCase();
        const fileUrl = `${config.baseURL}/images/uploads/${file.filename}`;

        switch (fileExtension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <img src={fileUrl} alt={file.filename} style={{ width: '200px' }} />;
            case 'pdf':
                return <embed src={fileUrl} type="application/pdf" width="200px" height="200px" />;
            default:
                return <a href={fileUrl} target="_blank" rel="noopener noreferrer">{file.filename}</a>;
        }
    };

    return (
        <div>
            <h2>Note Page</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files[0])} 
                    required 
                />
                <button type="submit">Upload File</button>
            </form>
            <div>
                {images.map((image) => (                        
                    <div key={image.id}>
                        {renderFile(image)}
                        <button onClick={() => handleImageDelete(noteId, image.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotePage;