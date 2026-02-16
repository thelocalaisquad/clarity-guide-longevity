import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={`flex-1 ${isHome ? "pt-[300px] md:pt-[320px]" : "pt-[120px] md:pt-[130px]"}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
