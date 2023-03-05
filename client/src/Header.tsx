import { Link } from "react-router-dom"; import DropdownMenu from './components/Dropdown';
import { useAuth } from './providers/AuthProvider';

function Header() {
  const { user, logOut } = useAuth();

  return (
    <nav className="navbar flex justify-around items-center h-12 gap-4">
      <Link to='/' className="btn btn-ghost">Home</Link>
      <form className="form-control grow">
        <div className="input-group">
          <input className="input input-bordered grow" type="text" placeholder="Search..." name="search" />
          <button className="btn btn-square" type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
      { user === null
        ? <>
            <Link to='/signin' className="btn btn-ghost">Sign In</Link>
            <Link to='/signup' className="btn btn-ghost">Sign Up</Link>
          </>
        : <>
            <DropdownMenu
              buttonClasses='btn btn-circle btn-outline'
              links={[
                { name: 'Dashboard', url: '/dashboard' },
                { name: 'Edit Account', url: '/account' },
                { name: 'Sign Out', action: () => logOut() }
              ]}
            >
              { user.name.charAt(0).toUpperCase() }
            </DropdownMenu>
          </>
      }
      <Link to='/posts/new' className="btn btn-primary">New Post</Link>
    </nav>
  );
}

export default Header;
