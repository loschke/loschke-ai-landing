import { Dot } from "@components/ui/Dot";
import { AvatarIntro } from "@components/ui/AvatarIntro";
import { useState, useEffect } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    // Get current path for active indicator
    const updatePath = () => setCurrentPath(window.location.pathname);
    updatePath();

    // Listen for Astro page transitions
    document.addEventListener("astro:page-load", updatePath);

    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("astro:page-load", updatePath);
    };
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = [
    { label: "Blog", href: "/blog" },
    { label: "Arbeit", href: "/arbeit" },
    { label: "Beratung", href: "/beratung" },
    { label: "Speaking", href: "/speaking" },
    { label: "Manifest", href: "/manifest" },
  ];

  // Check if link is active (exact match or starts with for nested routes like /blog/*)
  const isActive = (href: string) => {
    if (href === "/") return currentPath === "/";
    return currentPath === href || currentPath.startsWith(href + "/");
  };

  return (
    <>
      <nav
        className={`fixed top-[18px] left-[18px] right-[18px] z-50 flex items-center justify-between px-6 sm:px-10 md:px-16 lg:px-20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? "h-[56px] sm:h-[60px] bg-white/90 backdrop-blur-md border-b border-[#e5e5e5]"
            : "h-[70px] sm:h-[80px] bg-transparent border-b border-transparent"
        }`}
      >
        <div className="flex items-center">
          {/* Logo RL. - Visible on Scroll */}
          <div
            className={`absolute left-6 sm:left-10 md:left-16 lg:left-20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              scrolled
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
          >
            <a
              href="/"
              className="text-[22px] font-black tracking-[-0.02em] text-dark no-underline flex items-baseline"
            >
              RL<Dot />
            </a>
          </div>

          {/* AvatarIntro - Visible initially, fades out on scroll */}
          <div
            className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              scrolled
                ? "opacity-0 translate-y-4 pointer-events-none scale-95"
                : "opacity-100 translate-y-0 pointer-events-auto scale-100"
            }`}
          >
            <AvatarIntro />
          </div>
        </div>

        <div className="flex items-center gap-6 sm:gap-8 md:gap-10">
          {/* Desktop Navigation */}
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`hidden sm:inline text-sm md:text-base font-medium no-underline transition-colors duration-250 relative ${
                isActive(link.href)
                  ? "text-accent"
                  : "text-dark hover:text-accent"
              }`}
            >
              {link.label}
              {/* Active indicator dot */}
              {isActive(link.href) && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full" />
              )}
            </a>
          ))}

          {/* LinkedIn - Always visible */}
          <a
            href="https://www.linkedin.com/in/rico-loschke/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block text-dark hover:text-accent transition-colors duration-250"
            aria-label="LinkedIn Profile"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            aria-label="Menu öffnen"
          >
            <span
              className={`block w-6 h-0.5 bg-dark transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-dark transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-dark transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: "18px", left: "18px", right: "18px", bottom: "18px" }}
      >
        <div className="flex flex-col justify-center items-start h-full px-8 py-20">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-4xl font-black no-underline mb-6 transition-colors duration-250 flex items-center gap-3 ${
                isActive(link.href)
                  ? "text-accent"
                  : "text-dark hover:text-accent"
              }`}
              style={{
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                opacity: menuOpen ? 1 : 0,
                transition: `all 0.5s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.05}s`,
              }}
            >
              {link.label}
              {/* Active indicator for mobile */}
              {isActive(link.href) && (
                <span className="w-2 h-2 bg-accent rounded-full" />
              )}
            </a>
          ))}

          {/* LinkedIn in Mobile Menu */}
          <a
            href="https://www.linkedin.com/in/rico-loschke/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 text-dark hover:text-accent transition-colors duration-250"
            style={{
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              opacity: menuOpen ? 1 : 0,
              transition: `all 0.5s cubic-bezier(0.16,1,0.3,1) 0.3s`,
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
