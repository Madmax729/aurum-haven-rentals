
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, User, Home, Map, Heart, MessageSquare, Mail, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="aurum-container flex justify-between items-center h-16">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">
            Aurum<span className="text-foreground">Escape</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-1">
          <Button variant={location.pathname === "/explore" ? "default" : "ghost"} asChild>
            <Link to="/explore" className="flex items-center gap-1.5">
              <Search className="w-4 h-4" />
              <span>Explore</span>
            </Link>
          </Button>
          <Button variant={location.pathname === "/host" ? "default" : "ghost"} asChild>
            <Link to="/host" className="flex items-center gap-1.5">
              <Home className="w-4 h-4" />
              <span>Become a Host</span>
            </Link>
          </Button>
          <Button variant={location.pathname === "/contact" ? "default" : "ghost"} asChild>
            <Link to="/contact" className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </Link>
          </Button>
          {user ? (
            <>
              <Button variant={location.pathname === "/trips" ? "default" : "ghost"} asChild>
                <Link to="/trips">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  <span>Trips</span>
                </Link>
              </Button>
              <Button variant={location.pathname === "/favorites" ? "default" : "ghost"} asChild>
                <Link to="/favorites">
                  <Heart className="w-4 h-4 mr-1.5" />
                  <span>Wishlist</span>
                </Link>
              </Button>
              <Button variant={location.pathname === "/messages" ? "default" : "ghost"} asChild>
                <Link to="/messages">
                  <MessageSquare className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant={location.pathname === "/profile" ? "default" : "ghost"} asChild>
                <Link to="/profile">
                  <User className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="default" onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" asChild>
                <Link to="/auth">Log in</Link>
              </Button>
              <Button variant="default" asChild>
                <Link to="/auth">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-background border-b border-border animate-fade-in">
          <div className="aurum-container py-4 space-y-3">
            <Button variant={location.pathname === "/explore" ? "default" : "ghost"} asChild className="w-full justify-start" onClick={closeMenu}>
              <Link to="/explore" className="flex items-center gap-1.5">
                <Search className="w-4 h-4" />
                <span>Explore</span>
              </Link>
            </Button>
            <Button variant={location.pathname === "/host" ? "default" : "ghost"} asChild className="w-full justify-start" onClick={closeMenu}>
              <Link to="/host" className="flex items-center gap-1.5">
                <Home className="w-4 h-4" />
                <span>Become a Host</span>
              </Link>
            </Button>
            <Button variant={location.pathname === "/contact" ? "default" : "ghost"} asChild className="w-full justify-start" onClick={closeMenu}>
              <Link to="/contact" className="flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                <span>Contact</span>
              </Link>
            </Button>
            <Button variant={location.pathname === "/trips" ? "default" : "ghost"} asChild className="w-full justify-start" onClick={closeMenu}>
              <Link to="/trips" className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>Trips</span>
              </Link>
            </Button>
            <Button variant={location.pathname === "/favorites" ? "default" : "ghost"} asChild className="w-full justify-start" onClick={closeMenu}>
              <Link to="/favorites" className="flex items-center gap-1.5">
                <Heart className="w-4 h-4" />
                <span>Wishlist</span>
              </Link>
            </Button>
            <Button variant={location.pathname === "/messages" ? "default" : "ghost"} asChild className="w-full justify-start" onClick={closeMenu}>
              <Link to="/messages" className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                <span>Messages</span>
              </Link>
            </Button>
            <Button variant={location.pathname === "/profile" ? "default" : "ghost"} asChild className="w-full justify-start" onClick={closeMenu}>
              <Link to="/profile" className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
            </Button>
            <div className="flex flex-col space-y-2 pt-2 border-t border-border">
              {user ? (
                <Button variant="destructive" onClick={() => {
                  signOut();
                  closeMenu();
                }}>
                  Sign Out
                </Button>
              ) : (
                <>
                  <Button variant="secondary" asChild onClick={closeMenu}>
                    <Link to="/auth">Log in</Link>
                  </Button>
                  <Button variant="default" asChild onClick={closeMenu}>
                    <Link to="/auth">Sign up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
