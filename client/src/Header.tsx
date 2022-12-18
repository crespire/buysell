import { Link } from "react-router-dom";
import { useAuth } from './providers/AuthProvider';

function Header() {
  const { user, logOut } = useAuth();

  return (
    <div>
      <nav>
        <Link to='/'>Home</Link>
        { user === null 
          ? <>
              <Link to='/signup'>Sign Up</Link>
              <Link to='/signin'>Sign In</Link>
            </>
          : <>
              <span>Hello <Link to='/dashboard'>{ user.email }</Link></span>
              <button onClick={() => logOut()}>Sign Out</button>
              <Link to='/posts/new'>New Post</Link>
            </>
        }
      </nav>
      { user && user.status === 1 && <p>We're still waiting to confirm your account.</p> }
    </div>
  );
}

export default Header;