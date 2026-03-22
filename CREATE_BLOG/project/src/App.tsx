import React from 'react';
import { CreatePost } from './pages/CreatePost';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <CreatePost />
      <Toaster position="top-right" />
    </>
  );
}

export default App;