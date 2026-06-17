import { Outlet } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";

const UserLayout = () => {
  return (
    <div className="min-h-screen">
      <UserNavbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
