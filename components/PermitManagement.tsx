'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface Permit {
  id: string;
  title: string;
  type: string;
  location: string;
  requestedBy: string;
  approvedBy?: string;
  status: string;
  startDate: string;
  endDate: string;
  hazards: string;
  controls: string;
}

export default function PermitManagement() {
  const [permits, setPermits] = useState<Permit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPermits();
  }, []);

  const fetchPermits = async () => {
    try {
      const res = await fetch('/api/permits');
      const data = await res.json();
      setPermits(data);
    } catch (error) {
      console.error('Failed to fetch permits', error);
    }
  };

  const filteredPermits = permits.filter(permit =>
    permit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permit.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Permit Management</h2>
          <p className="text-gray-600 mt-1">Work permit tracking and approval system</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Request Permit</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search permits..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredPermits.map((permit) => (
          <PermitCard key={permit.id} permit={permit} />
        ))}
        {filteredPermits.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No permits found</p>
          </div>
        )}
      </div>

      {showModal && (
        <PermitModal
          onClose={() => setShowModal(false)}
          onSubmit={(data) => {
            fetch('/api/permits', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            })
              .then(() => {
                setShowModal(false);
                fetchPermits();
              })
              .catch(console.error);
          }}
        />
      )}
    </div>
  );
}

function PermitCard({ permit }: { permit: Permit }) {
  const statusColors = {
    'Pending Approval': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Expired': 'bg-gray-100 text-gray-800',
    'Active': 'bg-blue-100 text-blue-800',
  }[permit.status] || 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{permit.title}</h3>
          <p className="text-gray-600 text-sm">{permit.type}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors} whitespace-nowrap ml-3`}>
          {permit.status}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
        <div>
          <span className="text-gray-500">Location:</span>
          <p className="font-medium text-gray-900">{permit.location}</p>
        </div>
        <div>
          <span className="text-gray-500">Requested By:</span>
          <p className="font-medium text-gray-900">{permit.requestedBy}</p>
        </div>
        <div>
          <span className="text-gray-500">Start Date:</span>
          <p className="font-medium text-gray-900">
            {format(new Date(permit.startDate), 'MMM dd, yyyy')}
          </p>
        </div>
        <div>
          <span className="text-gray-500">End Date:</span>
          <p className="font-medium text-gray-900">
            {format(new Date(permit.endDate), 'MMM dd, yyyy')}
          </p>
        </div>
      </div>

      <div className="space-y-2 mt-4 pt-4 border-t border-gray-200">
        <div className="bg-orange-50 p-3 rounded">
          <p className="text-sm font-medium text-orange-900 mb-1">Hazards:</p>
          <p className="text-sm text-orange-700">{permit.hazards}</p>
        </div>
        <div className="bg-green-50 p-3 rounded">
          <p className="text-sm font-medium text-green-900 mb-1">Safety Controls:</p>
          <p className="text-sm text-green-700">{permit.controls}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        {permit.approvedBy && (
          <span className="text-sm text-gray-600">
            Approved by: <strong>{permit.approvedBy}</strong>
          </span>
        )}
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium ml-auto">
          View Details →
        </button>
      </div>
    </div>
  );
}

function PermitModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Hot Work',
    location: '',
    requestedBy: '',
    startDate: '',
    endDate: '',
    hazards: '',
    controls: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Request Work Permit</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Permit Title *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Permit Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option>Hot Work</option>
                <option>Confined Space</option>
                <option>Working at Heights</option>
                <option>Electrical Work</option>
                <option>Excavation</option>
              </select>
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requested By *</label>
            <input
              type="text"
              required
              value={formData.requestedBy}
              onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date/Time *</label>
              <input
                type="datetime-local"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date/Time *</label>
              <input
                type="datetime-local"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Identified Hazards *</label>
            <textarea
              required
              rows={3}
              placeholder="List all potential hazards associated with this work"
              value={formData.hazards}
              onChange={(e) => setFormData({ ...formData, hazards: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Safety Controls *</label>
            <textarea
              required
              rows={3}
              placeholder="Describe all safety measures and controls in place"
              value={formData.controls}
              onChange={(e) => setFormData({ ...formData, controls: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Submit Request
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
