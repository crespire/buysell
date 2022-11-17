import React, { useEffect } from 'react';
import { useAuth } from './providers/AuthProvider';
import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';

function App() {
  const { signUp } = useAuth();
  
  const handleClick = () => {
    signUp('test2@test.com', '123456');
  };

  return (
    <main className="App">
      <Header />
      <button onClick={handleClick}>Fire signup</button>
      <Outlet />
      <Footer />
    </main>
  );
}

export default App;
