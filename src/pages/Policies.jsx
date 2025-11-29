import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, DollarSign, Shield, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import PolicyModal from '../components/PolicyModal';
import { policyService } from '../services/policyService';
import { Info } from "lucide-react";
import PolicyInfoModal from '../components/PolicyInfoModal';
import LoadingSpinner from '../components/LoadingSpinner';

const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoPolicy, setInfoPolicy] = useState(null);

  useEffect(() => {
    fetchPolicies();
  }, []);

  useEffect(() => {
    filterPolicies();
  }, [policies, searchTerm, filterStatus]);

  const fetchPolicies = async () => {
    try {
      const data = await policyService.getAllPolicies();
      setPolicies(data);
    } catch (error) {
      console.error('Error fetching policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPolicies = () => {
    let filtered = [...policies];

    if (filterStatus !== 'All') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.insurer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.policyType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPolicies(filtered);
  };

  const handleAddPolicy = () => {
    setSelectedPolicy(null);
    setShowModal(true);
  };

  const handleEditPolicy = (policy) => {
    setSelectedPolicy(policy);
    setShowModal(true);
  };

  const getDaysUntilExpiry = (endDate) => {
  const today = new Date();
  const expiryDate = new Date(endDate);
  const diffTime = expiryDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

  const handleDeletePolicy = async (policyId) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      try {
        await policyService.deletePolicy(policyId);
        fetchPolicies();
      } catch (error) {
        console.error('Error deleting policy:', error);
        alert('Failed to delete policy');
      }
    }
  };

  // const fetchExpiringPolicies = async () => {
  //   setLoading(true);
  //   try {
  //     const data = await policyService.getExpiringPolicies();
  //     setPolicies(data); // show expiring policies
  //   } catch (error) {
  //     console.error('Error fetching expiring policies:', error);
  //     alert('Failed to fetch expiring policies');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedPolicy(null);
    fetchPolicies();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Lapsed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  const handleShowInfo = (policyId) => {
  const selected = policies.find(p => p.policyId === policyId);
  setInfoPolicy(selected);
  setShowInfoModal(true);
  };

  if (loading) {
      return <LoadingSpinner fullScreen text="Loading policies..." />;
    }

  return (
    <div className="min-h-screen bg-white pt-16">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                My Policies
              </h1>
              <p className="text-slate-600 mt-2">Manage your insurance policies</p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleAddPolicy}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 px-5 py-2.5 rounded-lg font-semibold hover:from-emerald-400 hover:to-cyan-400 transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/25"
              >
                <Plus className="h-5 w-5" />
                <span>Add Policy</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by insurer or policy type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white text-slate-800"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white text-slate-800"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Lapsed">Lapsed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-300 p-6 animate-pulse">
                <div className="h-6 bg-slate-100 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : filteredPolicies.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-300 p-12 text-center">
            <Shield className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No policies found</h3>
            <p className="text-slate-600 mb-6">Get started by adding your first policy</p>
            <button
              onClick={handleAddPolicy}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 px-6 py-3 rounded-lg font-semibold hover:from-emerald-400 hover:to-cyan-400 transition-all"
            >
              <Plus className="h-5 w-5" />
              <span>Add Policy</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolicies.map((policy) => (
              <div
                key={policy.policyId}
                className="bg-white rounded-xl border border-slate-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white">{policy.insurer}</h3>
                      <p className="text-cyan-100">{policy.policyType}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                  {/* If expired, show Lapsed */}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                    getDaysUntilExpiry(policy.endDate) <= 0 ? 'Lapsed' : policy.status
                  )}`}>
                    {getDaysUntilExpiry(policy.endDate) <= 0 ? 'Lapsed' : policy.status}
                  </span>


                  {/* Show expiry tag only if ≤ 30 days and > 0 */}
                  {getDaysUntilExpiry(policy.endDate) <= 30 && getDaysUntilExpiry(policy.endDate) > 0 && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-300">
                      Expires in {getDaysUntilExpiry(policy.endDate)} days
                    </span>
                  )}
                  </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3 mb-4 text-slate-800">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                      <span className="font-semibold">Premium:</span>
                      <span>₹{policy.premiumAmt?.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-cyan-600" />
                      <span className="font-semibold">Start:</span>
                      <span>{new Date(policy.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-cyan-600" />
                      <span className="font-semibold">End:</span>
                      <span>{new Date(policy.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t border-slate-300">
                    <button
                      onClick={() => handleEditPolicy(policy)}
                      className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>

                   <button
                      onClick={() => handleShowInfo(policy.policyId)}
                      className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                      <Info className="h-4 w-4" />
                      <span>Info</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <PolicyModal
          policy={selectedPolicy}
          onClose={handleModalClose}
        />
      )}
      {showInfoModal && (
      <PolicyInfoModal
      policy={infoPolicy}
      onClose={() => setShowInfoModal(false)}
      />
      )}
    </div>
  );
};

export default Policies;