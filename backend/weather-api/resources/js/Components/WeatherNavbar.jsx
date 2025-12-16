"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/Components/ui/resizable-navbar";
import { useState } from "react";
import { usePage, router } from "@inertiajs/react";

export function WeatherNavbar() {
  const { auth } = usePage().props;
  const user = auth?.user;

  const navItems = [
    {
      name: "Weather",
      link: "/",
    },
    {
      name: "Dashboard",
      link: "/dashboard",
    },
    {
      name: "Journey",
      link: "/journey",
    },
    {
      name: "Favorites",
      link: "/favorites",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <NavbarButton variant="ghost" href="/profile">
                  {user.name}
                </NavbarButton>
                <NavbarButton
                  variant="secondary"
                  onClick={handleLogout}
                >
                  Logout
                </NavbarButton>
              </>
            ) : (
              <>
                <NavbarButton variant="secondary" href="/login">
                  Login
                </NavbarButton>
                <NavbarButton variant="primary" href="/register">
                  Register
                </NavbarButton>
              </>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-300 hover:text-white"
              >
                <span className="block py-2">{item.name}</span>
              </a>
            ))}
            <div className="mt-4 flex w-full flex-col gap-3 border-t border-white/10 pt-4">
              {user ? (
                <>
                  <NavbarButton
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="ghost"
                    className="w-full"
                  >
                    {user.name} (Profile)
                  </NavbarButton>
                  <NavbarButton
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.post('/logout');
                    }}
                    variant="secondary"
                    className="w-full"
                  >
                    Logout
                  </NavbarButton>
                </>
              ) : (
                <>
                  <NavbarButton
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="secondary"
                    className="w-full"
                  >
                    Login
                  </NavbarButton>
                  <NavbarButton
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full"
                  >
                    Register
                  </NavbarButton>
                </>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}

export default WeatherNavbar;
