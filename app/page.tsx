'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  ClipboardCheck,
  GraduationCap,
  FileText,
  Beaker,
  Plus,
  TrendingUp,
  Activity
} from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import IncidentManagement from '@/components/IncidentManagement';
import InspectionManagement from '@/components/InspectionManagement';
import TrainingManagement from '@/components/TrainingManagement';
import PermitManagement from '@/components/PermitManagement';
import ChemicalManagement from '@/components/ChemicalManagement';

type TabType = 'dashboard' | 'incidents' | 'inspections' | 'training' | 'permits' | 'chemicals';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: Activity },
    { id: 'incidents' as TabType, label: 'Incidents', icon: AlertTriangle },
    { id: 'inspections' as TabType, label: 'Inspections', icon: ClipboardCheck },
    { id: 'training' as TabType, label: 'Training', icon: GraduationCap },
    { id: 'permits' as TabType, label: 'Permits', icon: FileText },
    { id: 'chemicals' as TabType, label: 'Chemicals', icon: Beaker },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">EHS Management System</h1>
                <p className="text-sm text-gray-500">Environment, Health & Safety Platform</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Admin User</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'incidents' && <IncidentManagement />}
        {activeTab === 'inspections' && <InspectionManagement />}
        {activeTab === 'training' && <TrainingManagement />}
        {activeTab === 'permits' && <PermitManagement />}
        {activeTab === 'chemicals' && <ChemicalManagement />}
      </main>
    </div>
  );
}
