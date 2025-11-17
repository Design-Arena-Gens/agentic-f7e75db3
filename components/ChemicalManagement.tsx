'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Beaker, ExternalLink, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Chemical {
  id: string;
  name: string;
  casNumber?: string;
  location: string;
  quantity: string;
  unit: string;
  hazardClass: string;
  sdsUrl?: string;
  expiryDate?: string;
  lastInspected?: string;
}

export default function ChemicalManagement() {
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchChemicals();
  }, []);

  const fetchChemicals = async () => {
    try {
      const res = await fetch('/api/chemicals');
      const data = await res.json();
      setChemicals(data);
    } catch (error) {
      console.error('Failed to fetch chemicals', error);
    }
  };

  const filteredChemicals = chemicals.filter(chemical =>
    chemical.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chemical.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (chemical.casNumber && chemical.casNumber.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chemical Inventory</h2>
          <p className="text-gray-600 mt-1">Track and manage hazardous materials inventory</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Chemical</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, location, or CAS number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredChemicals.map((chemical) => (
          <ChemicalCard key={chemical.id} chemical={chemical} />
        ))}
        {filteredChemicals.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Beaker className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No chemicals found</p>
          </div>
        )}
      </div>

      {showModal && (
        <ChemicalModal
          onClose={() => setShowModal(false)}
          onSubmit={(data) => {
            fetch('/api/chemicals', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            })
              .then(() => {
                setShowModal(false);
                fetchChemicals();
              })
              .catch(console.error);
          }}
        />
      )}
    </div>
  );
}

function ChemicalCard({ chemical }: { chemical: Chemical }) {
  const hazardColors = {
    'Flammable Liquid': 'bg-red-100 text-red-800 border-red-200',
    'Corrosive': 'bg-orange-100 text-orange-800 border-orange-200',
    'Toxic': 'bg-purple-100 text-purple-800 border-purple-200',
    'Oxidizer': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Compressed Gas': 'bg-blue-100 text-blue-800 border-blue-200',
  }[chemical.hazardClass] || 'bg-gray-100 text-gray-800 border-gray-200';

  const needsInspection = chemical.lastInspected &&
    new Date(chemical.lastInspected) < new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

  const isExpiringSoon = chemical.expiryDate &&
    new Date(chemical.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{chemical.name}</h3>
          {chemical.casNumber && (
            <p className="text-gray-600 text-sm">CAS: {chemical.casNumber}</p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${hazardColors} whitespace-nowrap ml-3`}>
          {chemical.hazardClass}
        </span>
      </div>

      {(needsInspection || isExpiringSoon) && (
        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            {needsInspection && (
              <p className="text-yellow-800">⚠️ Inspection overdue</p>
            )}
            {isExpiringSoon && (
              <p className="text-yellow-800">⚠️ Expiring within 90 days</p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
        <div>
          <span className="text-gray-500">Location:</span>
          <p className="font-medium text-gray-900">{chemical.location}</p>
        </div>
        <div>
          <span className="text-gray-500">Quantity:</span>
          <p className="font-medium text-gray-900">{chemical.quantity} {chemical.unit}</p>
        </div>
        {chemical.expiryDate && (
          <div>
            <span className="text-gray-500">Expiry Date:</span>
            <p className="font-medium text-gray-900">
              {format(new Date(chemical.expiryDate), 'MMM dd, yyyy')}
            </p>
          </div>
        )}
        {chemical.lastInspected && (
          <div>
            <span className="text-gray-500">Last Inspected:</span>
            <p className="font-medium text-gray-900">
              {format(new Date(chemical.lastInspected), 'MMM dd, yyyy')}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        {chemical.sdsUrl && (
          <a
            href={chemical.sdsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View SDS</span>
          </a>
        )}
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium ml-auto">
          Manage →
        </button>
      </div>
    </div>
  );
}

function ChemicalModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    casNumber: '',
    location: '',
    quantity: '',
    unit: 'L',
    hazardClass: 'Flammable Liquid',
    sdsUrl: '',
    expiryDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Add Chemical to Inventory</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chemical Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CAS Number</label>
              <input
                type="text"
                value={formData.casNumber}
                onChange={(e) => setFormData({ ...formData, casNumber: e.target.value })}
                placeholder="e.g., 67-64-1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hazard Class *</label>
              <select
                value={formData.hazardClass}
                onChange={(e) => setFormData({ ...formData, hazardClass: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option>Flammable Liquid</option>
                <option>Corrosive</option>
                <option>Toxic</option>
                <option>Oxidizer</option>
                <option>Compressed Gas</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location *</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                type="text"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option>L</option>
                <option>mL</option>
                <option>kg</option>
                <option>g</option>
                <option>gal</option>
                <option>lb</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SDS Document URL</label>
            <input
              type="url"
              value={formData.sdsUrl}
              onChange={(e) => setFormData({ ...formData, sdsUrl: e.target.value })}
              placeholder="https://example.com/sds/chemical.pdf"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add to Inventory
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
