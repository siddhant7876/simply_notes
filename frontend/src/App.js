import React, { useState, useCallback,useEffect } from 'react';
import axios from 'axios';
import config from './config';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import DirectoryForm from './components/DirectoryForm';
import ViewDirectories from './components/ViewDirectories';
import ViewNotes from './components/ViewNotes';
import NotePage from './components/NotePage';
import { api, setAuthToken } from './utils/api';


const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [notes, setNotes] = useState([]);
    const [message, setMessage] = useState('');
    const [directories, setDirectories] = useState([]);
    const [directoryId, setDirectoryId] = useState(null);
    const [noteId, setNoteId] = useState(null);
    const [images, setImages] = useState([]);
    const navigate = useNavigate();

    const handleRegister = async (username,password) => {
        // e.preventDefault();
        try{
          const response = await api.post(`${config.baseURL}/auth/register`, { username, password });
          setMessage(response.data.message); 
        } catch(error){
          setMessage('Regsitration failed');
        }
    };
    const handleLogin = async (username, password) => {
      try {
          const response = await api.post(`${config.baseURL}/auth/login`, { username, password });
          if (response.status === 200) {
              setMessage('Login successful');
              localStorage.setItem('token', response.data.access_token);
              setToken(response.data.access_token);
            //   setView('home');
            // navigate('/home');
            navigate('/home');
          } else {
              setMessage('Login failed');
          }
      } catch (error) {
          setMessage('Login failed');
      }
  };

  const fetchDirectories = useCallback(async () => {
    if (token) {
        try {
            const response = await api.get(`${config.baseURL}/directories/directories`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDirectories(response.data);
        } catch (error) {
            console.error('Failed to fetch directories', error);
        }
    }
}, [token]);
const fetchNotes = useCallback(async (directoryId) => {
    if (token) {
        try {
            const response = await api.get(`${config.baseURL}/directories/directories/${directoryId}/notes`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNotes(response.data.notes);
            setDirectoryId(directoryId);
        } catch (error) {
            console.error('Failed to fetch notes', error);
        }
    }
}, [token]);
const fetchImages = useCallback(async (noteId) => {
    if (token) {
        console.log("fetchImages",noteId);
        try {
            const response = await api.get(`${config.baseURL}/images/images/${noteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setImages(response.data);
            setNoteId(noteId);
        } catch (error) {
            console.error('Failed to fetch images', error);
        }
    }
}, [token]);

    const handleCreateDirectory = async (directoryName) => {
    //   e.preventDefault();
    //   const directoryName = e.target.elements['directory-name'].value;
      try {
          const response = await api.post(`${config.baseURL}/directories/create-directory`, { name: directoryName }, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          if (response.status === 200) {
              alert('Directory created successfully');
              fetchDirectories();
          } else {
              alert(response.data.message);
          }
      } catch (error) {
          alert('Directory creation failed');
      }
  };

  const handleViewDirectory = async (directoryId) => {
    
    try {
        console.log(directoryId);
        // const response = await api.get(`${config.baseURL}/directories/directories/${directoryId}/notes`, {
        //     headers: {
        //         Authorization: `Bearer ${token}`
        //     }
        // });
        // if (response.status === 200) {
        //     setNotes(response.data.notes);
        //     setDirectoryId(directoryId);
        //     await fetchNotes(directoryId);
        //     navigate('/view-notes');
        // } else {
        //     alert('Failed to fetch notes');
        // }
        fetchNotes(directoryId);
        localStorage.setItem('directoryId', directoryId);
        navigate(`/view-notes/${directoryId}`);
        
        
    } catch (error) {
        alert('Failed to fetch notes');
    }
};
  const handleDeleteDirectory = async (directoryId) => {
    try {
        const response = await api.delete(`${config.baseURL}/directories/directories/${directoryId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            alert('Directory deleted successfully');
            // Update the state to remove the deleted directory from the list
            setDirectories(directories.filter(directory => directory.id !== directoryId));
            // Clear the notes and images if the deleted directory was the currently viewed directory
            if (directoryId === noteId) {
                setImages([]);
                setNoteId(null);
                navigate('/view-directories');
            }
        } else {
            alert('Failed to delete directory');
        }
    } catch (error) {
        alert('Failed to delete directory');
    }
};

  const handleCreateNote = async (directoryId, title) => {
    try {
        console.log("handleCreateNote",directoryId);
        console.log("handleCreateNote title",title);
        const response = await api.post(`${config.baseURL}/notes/create-note`, {
            directory_id: directoryId,
            title: title
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 201) {
            alert('Note created successfully');
            setNotes([...notes, response.data.note]);
        } else {
            alert('Failed to create note');
        }
    } catch (error) {
        alert('Failed to create note');
    }
};
    const handleViewNotePage = (noteId) => {
        console.log(noteId);
        setNoteId(noteId);
        localStorage.setItem('noteId', noteId);
        fetchImages(noteId);
        navigate(`/note/${noteId}`);
        
    };
  const handleDeleteNote = async (noteId) => {
    try {
        const response = await api.delete(`${config.baseURL}/notes/notes/${noteId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            alert('Note deleted successfully');
            // Update the state to remove the deleted note from the list
            setNotes(notes.filter(note => note.id !== noteId));
            setImages([]);
            setNoteId(null);
        } else {
            alert('Failed to delete note');
        }
    } catch (error) {
        alert('Failed to delete note');
    }
};

const handleImageUpload = async (noteId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    console.log("handleImageUpload ",file)
    try {
        const response = await api.post(`${config.baseURL}/images/upload-image/${noteId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            alert('Image uploaded successfully');
            fetchImages(noteId); // Fetch the updated list of images
            // setImages([...images, response.data.image]); // Update the state with the new image
        } else {
            alert('Failed to upload image');
        }
    } catch (error) {
        console.error('Failed to upload image', error);
        alert('Failed to upload image');
    }
};
const handleImageDelete = async (noteId, imageId) => {
    try {
        const response = await api.delete(`${config.baseURL}/images/delete-image/${noteId}/${imageId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            alert('Image deleted successfully');
            fetchImages(noteId); // Fetch the updated list of images
        } else {
            alert('Failed to delete image');
        }
    } catch (error) {
        console.error('Failed to delete image', error);
        alert('Failed to delete image');
    }
};

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('directoryId'); // Clear directoryId from sessionStorage
        localStorage.removeItem('noteId');
    };

    useEffect(() => {
        fetchDirectories();
    }, [fetchDirectories]);
    useEffect(() => {
        setAuthToken(token);
        const storedDirectoryId = localStorage.getItem('directoryId');
        
        if (storedDirectoryId) {
            setDirectoryId(storedDirectoryId);
            fetchNotes(storedDirectoryId);
        } else {
            fetchDirectories(); // You might not want to fetch directories if the ID is missing, but keeping it for completeness.
        }
    }, [token, fetchDirectories, fetchNotes]);
    useEffect(() => {
        const storedNoteId = localStorage.getItem('noteId');
        
        if (storedNoteId) {
            setNoteId(storedNoteId);
            fetchImages(storedNoteId);
        }
    }, [fetchImages]);

    // useEffect(() => {
    //     setAuthToken(token);
    //     const storedDirectoryId = sessionStorage.getItem('directoryId');
    //     fetchDirectories();
    //     fetchNotes();
    //     fetchImages();
    // }, [token,fetchDirectories,fetchNotes,fetchImages]);


return (
        <div className="App">
            <Navbar token={token} onLogout={handleLogout} />
            <div className="content">
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/register" element={<RegisterForm handleRegister={handleRegister} />} />
                <Route path="/login" element={<LoginForm handleLogin={handleLogin} />} />
                <Route path="/create-directory" element={<DirectoryForm handleCreateDirectory={handleCreateDirectory} />} />
                <Route path="/view-directories" element={
                        <ViewDirectories 
                            directories={directories} 
                            handleViewDirectory={handleViewDirectory} 
                            handleDeleteDirectory={handleDeleteDirectory} 
                        />
                    }
                />
                <Route path="/view-notes/:directoryId" element={
                        <ViewNotes 
                            notes={notes} 
                            directoryId={directoryId}
                            handleViewNotePage={handleViewNotePage} 
                            handleDeleteNote={handleDeleteNote} 
                            handleCreateNote={handleCreateNote} 
                        />
                    } />
                <Route path="/note/:noteId" element={
                        <NotePage 
                            noteId={noteId} 
                            images={images} 
                            handleImageUpload={handleImageUpload} 
                            handleImageDelete={handleImageDelete} 
                        />
                    } />
            </Routes>
            </div>
        </div>
);
};

export default App;
