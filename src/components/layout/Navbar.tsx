
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, User, Home, Map, Heart, MessageSquare, Mail, Calendar, Luggage, Building, UserCircle, LogOut, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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

const MobileNav = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu />
      </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader className="pb-4">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col space-y-3 mt-4">
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                setIsOpen(false);
                navigate("/");
              }}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                setIsOpen(false);
                navigate("/explore");
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              Explore
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                setIsOpen(false);
                navigate("/favorites");
              }}
            >
              <Heart className="mr-2 h-4 w-4" />
              Wishlist
            </Button>
            {user && (
              <>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/trips");
                  }}
                >
                  <Luggage className="mr-2 h-4 w-4" />
                  Trips
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/messages");
                  }}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/host");
                  }}
                >
                  <Building className="mr-2 h-4 w-4" />
                  Become a Host
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/profile");
                  }}
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    setIsOpen(false);
                    signOut();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            )}
            {!user && (
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/auth");
                }}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

const DesktopNav = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex md:items-center md:justify-between w-full">
      <Link
        to="/"
        className="text-2xl font-bold text-primary flex items-center space-x-2"
      >
        <Home className="h-6 w-6" />
        <span>Aurum</span>
      </Link>

      <div className="relative hidden md:block mx-4 lg:mx-6 xl:mx-10 flex-grow max-w-md">
        <div className="flex items-center border rounded-full bg-background px-3 py-2 shadow-sm hover:shadow-md transition">
          <Button
            variant="ghost"
            className="text-base font-medium px-2 rounded-full h-auto hover:bg-transparent hover:text-current"
            onClick={() => navigate("/explore")}
          >
            Explore
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2" />
          <Button
            variant="ghost"
            className="text-base font-medium px-2 rounded-full h-auto hover:bg-transparent hover:text-current"
            onClick={() => navigate("/explore")}
          >
            Anywhere
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2" />
          <Button
            variant="ghost"
            className="text-base font-medium px-2 rounded-full h-auto hover:bg-transparent hover:text-current"
            onClick={() => navigate("/explore")}
          >
            Any week
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full ml-auto">
            <Search />
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-1">
        <Link to="/host">
          <Button variant="ghost" className="font-medium">
            Become a Host
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-muted-foreground/20"
            >
              <Avatar>
                {user?.user_metadata?.avatar_url ? (
                  <AvatarImage src={user.user_metadata.avatar_url} />
                ) : (
                  <AvatarFallback>
                    {user?.user_metadata?.first_name?.[0] ||
                      user?.email?.[0]?.toUpperCase() || (
                        <User className="h-4 w-4" />
                      )}
                  </AvatarFallback>
                )}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {user ? (
              <>
                <DropdownMenuLabel>
                  {user.user_metadata?.first_name
                    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                    : user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/favorites")}>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Wishlist</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/trips")}>
                  <Luggage className="mr-2 h-4 w-4" />
                  <span>Trips</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/messages")}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Messages</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/host")}>
                  <Building className="mr-2 h-4 w-4" />
                  <span>Host Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={() => navigate("/auth")}>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Log in</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/auth")}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Sign up</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
