import { Link } from "react-router-dom"; import DropdownMenu from './components/Dropdown';
import { useAuth } from './providers/AuthProvider';

function Header() {
  const { user, logOut } = useAuth();

  return (
    <nav className="flex justify-around items-center h-12">
      <Link to='/'>Home</Link>
      <form className="w-3/5">
        <input className="w-4/5 px-1" type="text" placeholder="Search for..." name="search" />
        <button className="w-1/5 px-1" type="submit">Go</button>
      </form>
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
                { name: 'Sign Out', action: () => logOut() }
              ]}
            >
              <div className="w-8 h-8 flex justify-center items-center rounded-full text-center bg-indigo-300">{ user.name.charAt(0).toUpperCase() }</div>
            </DropdownMenu>
          </>
      }
      <Link to='/posts/new'>New Post</Link>
    </nav>
  );
}

export default Header;
