import { useAuth } from '../providers/AuthProvider';

function Signup() {
  const { signUp } = useAuth();
  
  const handleClick = () => {
    signUp('test2@test.com', '123456');
  };

  return (
    <button onClick={handleClick}>Fire signup</button>
  );
}

export default Signup;