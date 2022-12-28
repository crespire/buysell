import { Link } from "react-router-dom";
import { useAuth } from './providers/AuthProvider';

function Header() {
  const { user, logOut } = useAuth();

  return (
    <div>
      <nav>
        <Link to='/'>Home</Link>
        { user === null || user === undefined
          ? <>
              <Link to='/signup'>Sign Up</Link>
              <Link to='/signin'>Sign In</Link>
            </>
          : <>
              <span>Hello <Link to='/dashboard'>{ user.name }</Link></span>
              { [2, 'verified'].includes(user.status) && (
                  <>
                    <Link to='/account'>Edit Account</Link>
                    <Link to='/posts/new'>New Post</Link>
                  </>
                )
              }
              <button onClick={() => logOut()}>Sign Out</button>              
            </>
        }
      </nav>
      { user && user.status === 1 && <p className="text-red-800">Please confirm your account by checking your email and clicking the link!</p> }
    </div>
  );
}

export default Header;