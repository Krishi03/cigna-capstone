import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { policyService } from '../services/policyService';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';

const PolicyModal = ({ policy, onClose }) => {
  const [formData, setFormData] = useState({
    insurer: '',
    policyType: '',
    premiumAmt: '',
    startDate: '',
    endDate: '',
    status: 'Active',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (policy) {
      setFormData({
        insurer: policy.insurer,
        policyType: policy.policyType,
        premiumAmt: policy.premiumAmt,
        startDate: policy.startDate?.split('T')[0] || '',
        endDate: policy.endDate?.split('T')[0] || '',
        status: policy.status,
      });
    }
  }, [policy]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.insurer || !formData.policyType || !formData.premiumAmt || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields');
      return false;
    }

    if (parseFloat(formData.premiumAmt) <= 0) {
      setError('Premium amount must be greater than 0');
      return false;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('End date must be after start date');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
  try {

    const token = localStorage.getItem('token');
    if (!token) {
      setError('User is not authenticated');
      setLoading(false);
      return;
    }

    const decoded = jwtDecode(token);
    const userId = decoded.id; 

    const policyData = {
      ...formData,
      premiumAmt: parseFloat(formData.premiumAmt),
      userId: userId, 
    };

    if (policy) {
      await policyService.updatePolicy(policy.policyId, policyData);
    } else {
      await policyService.createPolicy(policyData);
      console.log(policyData);
    }

    //toast
  toast.success("Done! Your policy is now in safe hands!", {
  position: "top-center",
  autoClose: 2500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,

  icon: () => (
    <span style={{ color: "white", fontSize: "22px", fontWeight: "bold" }}>✔</span>
  ),

  style: {
    fontSize: "18px",
    padding: "18px 22px",
    borderRadius: "14px",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",

    background: "linear-gradient(135deg, #6EE7B7, #38BDF8)",  // EXACT card gradient
    color: "#0F172A", // Slate-900 text (visible!)
    fontWeight: "600",

    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    border: "1px solid rgba(0,0,0,0.1)",
  }
});


    onClose();
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to save policy');
  } finally {
    setLoading(false);
  }
    
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-green-500 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {policy ? 'Edit Policy' : 'Add New Policy'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insurer *
              </label>
              <input
                type="text"
                name="insurer"
                value={formData.insurer}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., State Farm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Policy Type *
              </label>
              <select
                name="policyType"
                value={formData.policyType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select Type</option>
                <option value="Life">Life</option>
                <option value="Health">Health</option>
                <option value="Motor">Motor</option>
                <option value="Home">Home</option>
                <option value="Travel">Travel</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Premium Amount *
              </label>
              <input
                type="number"
                name="premiumAmt"
                value={formData.premiumAmt}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="Active">Active</option>
                <option value="Lapsed">Lapsed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? 'Saving...' : policy ? 'Update Policy' : 'Create Policy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PolicyModal;
