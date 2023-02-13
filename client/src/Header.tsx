import { Link } from "react-router-dom";
import DropdownMenu from './components/Dropdown';
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
              <DropdownMenu
                className='user-menu'
                links={[
                  ['Dashboard', '/dashboard'],
                  ['Edit Account', '/account']
                ]}
              >
                <span>{ user.name.charAt(0).toUpperCase() }</span>
              </DropdownMenu>
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
