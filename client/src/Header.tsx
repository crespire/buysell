import { Link } from "react-router-dom"; import DropdownMenu from './components/Dropdown';
import { useAuth } from './providers/AuthProvider';

function Header() {
  const { user, logOut } = useAuth();

  return (
    <nav className="flex justify-around items-center h-12">
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
                { name: 'Dashboard', url: '/dashboard' },
                { name: 'Edit Account', url: '/account' },
              ]}
            >
              <div className="w-8 h-8 flex justify-center items-center rounded-full text-center bg-indigo-300">{ user.name.charAt(0).toUpperCase() }</div>
            </DropdownMenu>
            <button onClick={() => logOut()}>Sign Out</button> 
          </>
      }
      <Link to='/posts/new'>New Post</Link>
    </nav>
  );
}

export default Header;
