import { ReactNode } from "react";
import { Link, useLocation } from "./Router";
import icon from "../assets/icon.png";

function Nav() {
  return (
    <div className="px-6 pt-4">
      <nav className="max-w-[800px] mx-auto flex justify-between items-center px-5 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-semibold text-text hover:no-underline">
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <img src={icon} alt="Force Focus" className="w-full h-full" />
          </div>
          Force Focus
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/support" className="text-sm text-text-muted hover:text-text hover:no-underline">
            Support
          </Link>
          <a
            href="https://github.com/miketromba/force-focus"
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-surface-elevated text-text-secondary border border-border-light hover:bg-border-light hover:no-underline transition-all"
            target="_blank"
            rel="noopener"
          >
            GitHub
          </a>
        </div>
      </nav>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-8">
      <div className="max-w-[800px] mx-auto text-center">
        <div className="flex justify-center gap-8 mb-4 flex-wrap">
          <Link href="/privacy" className="text-sm text-text-muted hover:text-text">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-text-muted hover:text-text">
            Terms of Service
          </Link>
          <Link href="/support" className="text-sm text-text-muted hover:text-text">
            Support
          </Link>
        </div>
        <p className="text-xs text-text-muted">&copy; 2025 Flame Lab LLC. All rights reserved.</p>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      <main className="flex-1 max-w-[800px] mx-auto px-6 py-16 w-full">{children}</main>
      <Footer />
    </>
  );
}
