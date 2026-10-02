import { useLocation } from "react-router";
import logoUrl from "../assets/logo.svg";
import { TransitionLink } from "../app/SiteLayout";
import Button from "./Button";

const links = [
  { label: "Work", to: "/work" },
  { label: "About", to: "/about" },
  { label: "Resume", to: "/resume" },
  { label: "Contact", to: "/#contact" },
];

export default function Navbar() {
  const location = useLocation();
  const workIsActive = location.pathname.startsWith("/work");

  return (
    <nav className="navbar" aria-label="Primary navigation">
      <TransitionLink className="monogram" to="/" aria-label="Siddhikka, home">
        <img src={logoUrl} alt="" />
      </TransitionLink>
      <div className="nav-links">
        {links.map((link) => (
          <Button
            key={link.label}
            variant="text"
            to={link.to}
            arrow={false}
            active={
              link.to === "/work"
                ? workIsActive
                : location.pathname === link.to
            }
          >
            {link.label}
          </Button>
        ))}
      </div>
    </nav>
  );
}
