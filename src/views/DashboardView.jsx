import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/ui/custom/DashboardLayout";

export const DashboardView = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
      profileName="Victory Chibuakunna" // We will replace this with real dynamic server data fields later
    >
      {/* ⚡ THE MAIN VIEW WORKSPACE: This content switches dynamically inside your layout children */}
      <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm border-dashed text-center text-slate-400 text-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-1">
          Content Screen Ready
        </h3>
        <p>
          The workspace framework for the{" "}
          <span className="font-semibold text-indigo-600 uppercase">
            {activeTab}
          </span>{" "}
          component loaded cleanly without error parameters.
        </p>
      </div>
    </DashboardLayout>
  );
};
