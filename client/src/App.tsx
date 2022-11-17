import React, { useEffect } from 'react';
import { useAuth } from './providers/AuthProvider';
import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';

function App() {

  return (
    <main className="App">
      <Header />    
      <Outlet />
      <Footer />
    </main>
  );
}

export default App;
