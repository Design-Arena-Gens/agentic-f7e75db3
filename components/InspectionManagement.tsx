'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, ClipboardCheck } from 'lucide-react';
import { format } from 'date-fns';

interface Inspection {
  id: string;
  title: string;
  type: string;
  location: string;
  inspector: string;
  status: string;
  score?: number;
  findings?: string;
  dueDate: string;
  completedAt?: string;
}

export default function InspectionManagement() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    try {
      const res = await fetch('/api/inspections');
      const data = await res.json();
      setInspections(data);
    } catch (error) {
      console.error('Failed to fetch inspections', error);
    }
  };

  const filteredInspections = inspections.filter(inspection =>
    inspection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inspection.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inspection Management</h2>
          <p className="text-gray-600 mt-1">Schedule and track facility inspections</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Schedule Inspection</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search inspections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredInspections.map((inspection) => (
          <InspectionCard key={inspection.id} inspection={inspection} />
        ))}
        {filteredInspections.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No inspections found</p>
          </div>
        )}
      </div>

      {showModal && (
        <InspectionModal
          onClose={() => setShowModal(false)}
          onSubmit={(data) => {
            fetch('/api/inspections', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            })
              .then(() => {
                setShowModal(false);
                fetchInspections();
              })
              .catch(console.error);
          }}
        />
      )}
    </div>
  );
}

function InspectionCard({ inspection }: { inspection: Inspection }) {
  const statusColors = {
    'Scheduled': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-green-100 text-green-800',
    'Overdue': 'bg-red-100 text-red-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
  }[inspection.status] || 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{inspection.title}</h3>
          <p className="text-gray-600 text-sm">{inspection.type} Inspection</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors}`}>
          {inspection.status}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
        <div>
          <span className="text-gray-500">Location:</span>
          <p className="font-medium text-gray-900">{inspection.location}</p>
        </div>
        <div>
          <span className="text-gray-500">Inspector:</span>
          <p className="font-medium text-gray-900">{inspection.inspector}</p>
        </div>
        <div>
          <span className="text-gray-500">Due Date:</span>
          <p className="font-medium text-gray-900">
            {format(new Date(inspection.dueDate), 'MMM dd, yyyy')}
          </p>
        </div>
        {inspection.score !== undefined && (
          <div>
            <span className="text-gray-500">Score:</span>
            <p className="font-medium text-gray-900">{inspection.score}/100</p>
          </div>
        )}
      </div>

      {inspection.findings && (
        <div className="mt-3 p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600"><strong>Findings:</strong> {inspection.findings}</p>
        </div>
      )}

      <div className="flex items-center justify-end mt-3">
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          View Details →
        </button>
      </div>
    </div>
  );
}

function InspectionModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Safety',
    location: '',
    inspector: '',
    dueDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Schedule Inspection</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option>Safety</option>
                <option>Environmental</option>
                <option>Compliance</option>
                <option>Quality</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inspector *</label>
            <input
              type="text"
              required
              value={formData.inspector}
              onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Schedule
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
