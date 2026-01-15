import SuperAdminLayout from "../../components/layout/SuperAdminLayout";
import AdminAumList from "./AdminAumList";

export default function DashboardSuperAdmin() {
  // const admin =
  //   JSON.parse(localStorage.getItem("adminAccessToken")) || {};

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">
            Dashboard Superadmin
          </h2>
          <p className="text-sm text-gray-500">
            Selamat datang
          </p>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-gray-500">
              Total Admin
            </p>
            <h3 className="text-2xl font-semibold">
              —
            </h3>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-gray-500">
              Total User
            </p>
            <h3 className="text-2xl font-semibold">
              —
            </h3>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-gray-500">
              Total Company HRD
            </p>
            <h3 className="text-2xl font-semibold">
              —
            </h3>
          </div>
        </div>

        {/* QUICK ACTION */}
        <div className="bg-white border rounded-xl p-5">
          <h3 className="font-medium mb-3">
            Quick Action
          </h3>

          <div className="flex gap-3">
            <a
              href="/superadmin/admin/add"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm"
            >
              Tambah Admin
            </a>
          </div>
        </div>

        <AdminAumList />
      </div>
    </SuperAdminLayout>
  );
}
