import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Guide from "./pages/Guide";
import Gallery from "./pages/Gallery";
import Editor from "./pages/Editor";
import WishSiteView from "./pages/WishSiteView";
import DemoSite from "./pages/DemoSite";
import Auth from "./pages/Auth";
import MyWishes from "./pages/MyWishes";

export default function App() {
  const location = useLocation();
  const siteMode = location.pathname.startsWith("/wish/")
    || location.pathname.startsWith("/demo/")
    || location.pathname.startsWith("/s/");

  return (
    <>
      {!siteMode && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/templates" element={<Gallery />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/create/:templateId" element={<Editor />} />
        <Route path="/wish/:id" element={<WishSiteView />} />
        <Route path="/wish/:id/:page" element={<WishSiteView />} />
        <Route path="/s/:code" element={<WishSiteView />} />
        <Route path="/s/:code/:page" element={<WishSiteView />} />
        <Route path="/demo/:templateId" element={<DemoSite />} />
        <Route path="/demo/:templateId/:page" element={<DemoSite />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/mine" element={<MyWishes />} />
      </Routes>
      {!siteMode && <footer className="footer">Wish Lite · Each template is a 5–6 page website.</footer>}
    </>
  );
}
