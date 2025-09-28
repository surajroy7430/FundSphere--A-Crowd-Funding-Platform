import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import QuickStats from "../../components/admin/quick-stats";
import UsersTable from "../../components/admin/users-table";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-1">
          <span>Welcome, {user?.username}</span>
          <span className="text-muted-foreground/50 text-xl font-medium">
            ({user?.role})
          </span>
        </h1>
        <Button className="px-3" size="sm">
          Settings
        </Button>
      </div>

      {/* Quick Stats */}
      <QuickStats stats={[]} />

      {/* User Lists Table */}
      <div className="min-h-screen flex-1 md:min-h-min">
        <UsersTable />
      </div>
    </>
  );
};

export default AdminDashboard;
