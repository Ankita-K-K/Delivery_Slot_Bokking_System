import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default AdminLayout;
