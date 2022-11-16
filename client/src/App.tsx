import React, { useEffect } from 'react';
import { useAuth } from './providers/AuthProvider';

function App() {
  const { signUp } = useAuth();
  
  const handleClick = () => {
    signUp('test2@test.com', '123456');
  };

  return (
    <div className="App">
      <button onClick={handleClick}>Fire signup</button>
    </div>
  );
}

export default App;
