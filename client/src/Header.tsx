import { Link } from "react-router-dom";

function Header() {
  return (
    <div>
      <nav>
        <Link to='/'>Home</Link>
        <Link to='/signup'>Sign Up</Link>
      </nav>
    </div>
  );
}

export default Header;