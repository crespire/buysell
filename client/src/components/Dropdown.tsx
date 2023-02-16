import { ReactNode, useRef, useEffect, useState, EventHandler } from "react";
import { Link, useLocation } from "react-router-dom";

interface BaseMenuItem {
  name: string;
}

interface LinkItem extends BaseMenuItem {
  url: string;
  action?: never;
}

interface ButtonItem extends BaseMenuItem {
  action: () => unknown;
  url?: never;
}

type MenuItem = LinkItem | ButtonItem;

interface DropdownMenuProps {
  className: string;
  links: Array<MenuItem>;
  children?: ReactNode;
}

function DropdownMenu({className, links, children}: DropdownMenuProps) {
  let location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Close after navigation
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Additional usability
  useEffect(() => {
    function checkOutsideClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.code === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', checkOutsideClick);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('click', checkOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return (
    <div ref={menuRef} className={ "relative " + className}>
      <button onClick={() => setIsOpen(!isOpen)}>{ children }</button>
      { isOpen && (
        <ul className="absolute w-fit top-9 bg-white p-2 border b-slate-200">
         { links.map((link, index) => (          
            <li key={ index }>
              { link.url && (
                <Link to={ link.url }>{ link.name }</Link>
              )}
              { link.action && (
                <button onClick={ link.action }>{ link.name }</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;

