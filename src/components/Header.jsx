import { Link, NavLink } from "react-router";
import { Menu, Search, ShoppingCart, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger Menu */}
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.href}
                    className={({ isActive }) =>
                      `flex w-full items-center text-lg font-semibold ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            AcmeCorp
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-6">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" nativeButton={false} render={<Link to="/search" />}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon" nativeButton={false} render={<Link to="/account" />}>
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
          </Button>
          <Button variant="ghost" size="icon" nativeButton={false} render={<Link to="/cart" />}>
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
