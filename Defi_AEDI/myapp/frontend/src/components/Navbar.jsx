import { NavLink } from 'react-router-dom';

export default function Navbar() 
{

  const linkStyle = 
  {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    marginRight: '1rem',
    transition: 'background 0.3s',
  };

  const activeStyle = 
  {
    backgroundColor: '#61dafb',
    color: 'black',
  };

  return (
    <nav style={{ backgroundColor: '#282c34', padding: '1rem', display: 'flex' ,justifyContent: "center",alignItems: "center"}}>
      <NavLink
        to="/"
        style={({ isActive }) =>
          isActive ? { ...linkStyle, ...activeStyle } : linkStyle
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/overview"
        style={({ isActive }) =>
          isActive ? { ...linkStyle, ...activeStyle } : linkStyle
        }
      >
        Overview
      </NavLink>
    </nav>
  );
}
