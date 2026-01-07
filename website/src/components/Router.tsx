import { createContext, useContext, useState, useEffect, ReactNode, MouseEvent } from "react";

const RouterContext = createContext<{
  path: string;
  navigate: (to: string) => void;
}>({
  path: "/",
  navigate: () => {},
});

export function useLocation() {
  return useContext(RouterContext);
}

export function Router({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo(0, 0);
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function Route({ path, component: Component }: { path: string; component: () => JSX.Element }) {
  const { path: currentPath } = useLocation();
  if (currentPath !== path) return null;
  return <Component />;
}

export function Link({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const { navigate } = useLocation();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("http") || href.startsWith("mailto:")) return;
    e.preventDefault();
    navigate(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
