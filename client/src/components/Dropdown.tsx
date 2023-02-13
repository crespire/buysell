import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface DropdownMenuProps {
  className: string;
  links: Array<Array<string>>;
  children?: ReactNode;
}

function DropdownMenu({className, links, children}: DropdownMenuProps) {
  let location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Close after navigation
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <div className={className}>
      <button onClick={() => setIsOpen(!isOpen)}>{ children }</button>
      { isOpen && (
        <ul>
          { links.map(([name, url]) => (
            <li key={ name }>
              <Link to={ url }>{ name }</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;

