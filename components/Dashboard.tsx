'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, TrendingUp, Users, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Stats {
  totalIncidents: number;
  openIncidents: number;
  inspectionsDue: number;
  trainingCompliance: number;
  pendingPermits: number;
  chemicalInventory: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalIncidents: 0,
    openIncidents: 0,
    inspectionsDue: 0,
    trainingCompliance: 0,
    pendingPermits: 0,
    chemicalInventory: 0,
  });

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {
        setStats({
          totalIncidents: 15,
          openIncidents: 3,
          inspectionsDue: 5,
          trainingCompliance: 87,
          pendingPermits: 2,
          chemicalInventory: 45,
        });
      });
  }, []);

  const incidentData = [
    { month: 'Jan', incidents: 4 },
    { month: 'Feb', incidents: 2 },
    { month: 'Mar', incidents: 5 },
    { month: 'Apr', incidents: 3 },
    { month: 'May', incidents: 1 },
    { month: 'Jun', incidents: 0 },
  ];

  const severityData = [
    { name: 'Low', value: 8, color: '#10b981' },
    { name: 'Medium', value: 5, color: '#f59e0b' },
    { name: 'High', value: 2, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Incidents (30d)"
          value={stats.totalIncidents}
          icon={AlertTriangle}
          color="blue"
          trend="-20%"
        />
        <StatCard
          title="Open Incidents"
          value={stats.openIncidents}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Inspections Due"
          value={stats.inspectionsDue}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Training Compliance"
          value={`${stats.trainingCompliance}%`}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Pending Permits"
          value={stats.pendingPermits}
          icon={FileText}
          color="red"
        />
        <StatCard
          title="Chemical Inventory"
          value={stats.chemicalInventory}
          icon={TrendingUp}
          color="indigo"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incidents Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Trend (6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incidentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="incidents" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <ActivityItem
            title="New incident reported"
            description="Slip and fall in Warehouse A"
            time="2 hours ago"
            type="incident"
          />
          <ActivityItem
            title="Inspection completed"
            description="Fire safety inspection - Building A"
            time="5 hours ago"
            type="inspection"
          />
          <ActivityItem
            title="Training scheduled"
            description="Hazardous Waste Management - 15 registered"
            time="1 day ago"
            type="training"
          />
          <ActivityItem
            title="Permit approved"
            description="Hot work permit for welding operations"
            time="2 days ago"
            type="permit"
          />
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend?: string;
}

function StatCard({ title, value, icon: Icon, color, trend }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    indigo: 'bg-indigo-100 text-indigo-600',
  }[color];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1">{trend} from last month</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  type: string;
}

function ActivityItem({ title, description, time, type }: ActivityItemProps) {
  const typeColors = {
    incident: 'bg-red-100 text-red-600',
    inspection: 'bg-green-100 text-green-600',
    training: 'bg-blue-100 text-blue-600',
    permit: 'bg-yellow-100 text-yellow-600',
  }[type] || 'bg-gray-100 text-gray-600';

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`p-2 rounded ${typeColors}`}>
        <div className="w-2 h-2 rounded-full bg-current"></div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
    </div>
  );
}
