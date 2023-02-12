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
              <Link to='/signin'>Sign In</Link>
              <Link to='/signup'>Sign Up</Link>
            </>
          : <>
              <Link to='/dashboard'>{ user.name[0] }</Link>
              <button onClick={() => logOut()}>Sign Out</button> 
            </>
        }
        <Link to='/posts/new'>New Post</Link>
      </nav>
      { user && user.status === 1 && <p className="verify text-red-800">Please confirm your account by checking your email and clicking the link!</p> }
    </div>
  );
}

export default Header;
