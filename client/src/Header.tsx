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
              <span>Hello { user.name }</span>
              <button onClick={() => logOut()}>Sign Out</button>
            </>
        }
      </nav>
      { user && user.status === 1 && <p>We're still waiting to confirm your account.</p> }
    </div>
  );
}

export default Header;