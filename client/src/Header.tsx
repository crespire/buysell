import { Link } from "react-router-dom"; import DropdownMenu from './components/Dropdown';
import { useAuth } from './providers/AuthProvider';

function Header() {
  const { user, logOut } = useAuth();

  return (
    <nav className="navbar flex justify-between items-center h-12 px-24">
      <div>
        <Link to='/' className="btn btn-ghost">Home</Link>
      </div>
      <div className="flex gap-4">
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
      </div>
    </nav>
  );
}

export default Header;
