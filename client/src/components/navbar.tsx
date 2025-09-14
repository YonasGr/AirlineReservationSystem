import { Link, useLocation } from "wouter";
import { Plane } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center space-x-4 cursor-pointer">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-ethiopian-green to-ethiopian-gold rounded-full flex items-center justify-center">
                  <Plane className="text-white h-5 w-5" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-xl text-ethiopian-green">
                    Ethiopian Airlines
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Connecting Africa to the World
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" data-testid="link-book-flight">
              <span className={`nav-btn transition-colors cursor-pointer ${
                isActive("/") 
                  ? "text-primary font-medium" 
                  : "text-foreground hover:text-primary"
              }`}>
                Book Flight
              </span>
            </Link>
            <Link href="/dashboard" data-testid="link-dashboard">
              <span className={`nav-btn transition-colors cursor-pointer ${
                isActive("/dashboard")
                  ? "text-primary font-medium"
                  : "text-foreground hover:text-primary"
              }`}>
                Dashboard
              </span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors" data-testid="button-user">
              <i className="fas fa-user"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
