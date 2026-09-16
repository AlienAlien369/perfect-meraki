import React, { useEffect, useState } from "react";
import { FiUsers, FiShield, FiBox, FiCalendar } from "react-icons/fi";
import apiClient from "@/api/apiClient";
import { API_ROUTES } from "@/api/APIRoutes";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import Spinner from "@/components/common/Spinner";

interface TypeCount {
  _id: string;
  count: number;
}

interface DashboardData {
  totalUsers: number;
  totalAdmins: number;
  totalRegularUsers: number;
  totalProducts: number;
  totalWorkshops: number;
  productsByType: TypeCount[];
  workshopsByType: TypeCount[];
}

function Breakdown({ title, items }: { title: string; items: TypeCount[] }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="bg-white rounded-2xl border border-sand p-5 shadow-sm">
      <h3 className="font-display text-lg text-espresso mb-4">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-espresso/50">No data yet.</p>
      ) : (
        <div className="space-y-3">
          {items
            .slice()
            .sort((a, b) => b.count - a.count)
            .map((item) => (
              <div key={item._id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize text-espresso/80">{item._id}</span>
                  <span className="text-espresso/50">{item.count}</span>
                </div>
                <div className="h-2 rounded-full bg-sand-light overflow-hidden">
                  <div
                    className="h-full bg-green rounded-full"
                    style={{ width: `${(item.count / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiClient.get(API_ROUTES.DASHBOARD);
        setData(res.data.data);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
        setError("Couldn't load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div>
      <PageHeader title="Dashboard" description="An overview of your storefront" />

      {loading ? (
        <div className="py-16">
          <Spinner label="Loading dashboard..." />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-sm">
          {error}
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Users" value={data.totalUsers} icon={FiUsers} accent="green" />
            <StatCard label="Admins" value={data.totalAdmins} icon={FiShield} accent="espresso" />
            <StatCard label="Products" value={data.totalProducts} icon={FiBox} accent="green" />
            <StatCard label="Workshops" value={data.totalWorkshops} icon={FiCalendar} accent="espresso" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Breakdown title="Products by Type" items={data.productsByType} />
            <Breakdown title="Workshops by Type" items={data.workshopsByType} />
          </div>
        </>
      ) : null}
    </div>
  );
}
