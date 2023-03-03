import { Link } from "react-router-dom"; import DropdownMenu from './components/Dropdown';
import { useAuth } from './providers/AuthProvider';

function Header() {
  const { user, logOut } = useAuth();

  return (
    <nav className="navbar flex justify-around items-center h-12">
      <Link to='/' className="btn btn-ghost">Home</Link>
      <form className="form-control w-3/5">
        <div className="input-group">
          <input className="w-4/5 px-1 input input-bordered" type="text" placeholder="Search for..." name="search" />
          <button className="w-1/5 px-1 btn btn-ghost" type="submit">Go</button>
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
