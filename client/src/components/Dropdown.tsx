import { ReactNode, useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface DropdownMenuProps {
  className: string;
  links: { name: string, url: string  }[];
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
    <div ref={menuRef} className={className}>
      <button className="relative" onClick={() => setIsOpen(!isOpen)}>{ children }</button>
      { isOpen && (
        <ul className="absolute top-11 bg-white p-2 border b-slate-200">
         { links.map((link, index) => (          
            <li key={ index }>
              <Link to={ link.url }>{ link.name }</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;

