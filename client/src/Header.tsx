import { Link } from "react-router-dom";
import { useAuth } from './providers/AuthProvider';

function Header() {
  const { user } = useAuth();

  return (
    <div>
      <nav>
        <Link to='/'>Home</Link>
        <Link to='/signup'>Sign Up</Link>
        <Link to='/signin'>Sign In</Link>
      </nav>
      { user && <span>Hello { user.name }! { user.status === 1 && "We're still waiting to confirm your account." }</span> }
    </div>
  );
}

export default Header;