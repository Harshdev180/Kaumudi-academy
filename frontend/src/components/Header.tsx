import { Search } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-primary">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 21V3H7V7H17V3H21V21H17V17H7V21H3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 7V17H17V7H7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-serif text-xl font-semibold text-foreground">
              Kaumudi Sanskrit Academy
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/courses" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Courses
            </Link>
            <Link to="/scholarships" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Scholarships
            </Link>
            <Link to="/library" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Library
            </Link>
            <Link to="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              About Us
            </Link>
          </nav>

          {/* Search and Sign In */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Find a course..."
                className="bg-transparent text-sm outline-none w-40 placeholder:text-muted-foreground"
              />
            </div>
            {/* <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-maroon-dark transition-colors">
              Sign In
            </button> */}
            <Link
  to="/signin"
  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-maroon-dark transition-colors"
>
  Sign In
</Link>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
