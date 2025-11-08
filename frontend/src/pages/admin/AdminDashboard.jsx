import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const AdminDashboard = () => {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('staff');
  const [staffList, setStaffList] = useState([]);
  const [vaccineStock, setVaccineStock] = useState([]); // This must be an array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Forms
  const [staffForm, setStaffForm] = useState({
    name: '',
    phone_number: '',
    email: '',
    password: '',
    address: '',
  });
  const [stockForm, setStockForm] = useState({
    vaccine_name: '',
    quantity: '',
  });
  const [assignForm, setAssignForm] = useState({
    staffId: '',
    vaccine_name: '',
    quantity: '',
    assigned_date: '',
  });

  useEffect(() => {
    if (!admin) {
      navigate('/admin/auth');
      return;
    }
    fetchData();
  }, [admin, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const staffResponse = await adminAPI.getStaff({ adminId: admin._id });
      if (staffResponse.data.success) {
        setStaffList(staffResponse.data.data || []); // Default to array
      }

      const stockResponse = await adminAPI.getStock({ adminId: admin._id });
      
      // --- THIS IS THE FIX ---
      if (stockResponse.data.success) {
        // Access the nested 'stock' array from your API response
        // and ensure it's always an array.
        const stockData = stockResponse.data.data?.stock || []; 
        setVaccineStock(stockData);
      }
      // --- END OF FIX ---

    } catch (err) {
      setError('Failed to fetch data');
      console.error(err); // Log the actual error
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await adminAPI.createStaff({
        ...staffForm,
        adminId: admin._id,
      });
      if (response.data.success) {
        setSuccess('Staff created successfully!');
        setStaffForm({
          name: '',
          phone_number: '',
          email: '',
          password: '',
          address: '',
        });
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create staff');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await adminAPI.updateStock({
        ...stockForm,
        adminId: admin._id,
      });
      if (response.data.success) {
        setSuccess('Vaccine stock updated successfully!');
        setStockForm({ vaccine_name: '', quantity: '' });
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignVaccine = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await adminAPI.assignVaccine({
        ...assignForm,
        adminId: admin._id,
      });
      if (response.data.success) {
        setSuccess('Vaccine assigned successfully!');
        setAssignForm({
          staffId: '',
          vaccine_name: '',
          quantity: '',
          assigned_date: '',
        });
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign vaccine');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await adminAPI.logout({ adminId: admin._id });
      logoutAdmin();
      navigate('/');
    } catch (err) {
      logoutAdmin();
      navigate('/');
    }
  };
  
  const calculateUsed = (staff) => {
    if (!staff.assigned_vaccine || !staff.assigned_vaccine.assigned_quantity) return 0;
    const assigned = staff.assigned_vaccine.assigned_quantity || 0;
    const remaining = staff.assigned_vaccine.remaining_quantity || 0;
    return assigned - remaining;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50"> {/* Assuming Header is imported */}
      <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-2xl p-6 mb-6">
            <div className="flex flex-wrap space-x-4 border-b mb-6">
              <button
                onClick={() => setActiveTab('staff')}
                className={`px-4 py-3 font-semibold ${
                  activeTab === 'staff'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                Create Staff
              </button>
              <button
                onClick={() => setActiveTab('stock')}
                className={`px-4 py-3 font-semibold ${
                  activeTab === 'stock'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                Manage Stock
              </button>
              <button
                onClick={() => setActiveTab('assign')}
                className={`px-4 py-3 font-semibold ${
                  activeTab === 'assign'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                Assign Vaccine
              </button>
              <button
                onClick={() => setActiveTab('wastage')}
                className={`px-4 py-3 font-semibold ${
                  activeTab === 'wastage'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                View Report
              </button>
            </div>

            {activeTab === 'staff' && (
              <form onSubmit={handleCreateStaff} className="space-y-4">
                <h2 className="text-2xl font-bold mb-4 text-gray-700">Create New Staff Member</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={staffForm.name}
                      onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={staffForm.phone_number}
                      onChange={(e) => setStaffForm({ ...staffForm, phone_number: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={staffForm.email}
                      onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={staffForm.password}
                      onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={staffForm.address}
                      onChange={(e) => setStaffForm({ ...staffForm, address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
                >
                  {loading ? 'Creating...' : 'Create Staff'}
                </button>
              </form>
            )}

            {activeTab === 'stock' && (
              <div>
                <form onSubmit={handleUpdateStock} className="space-y-4 mb-6">
                  <h2 className="text-2xl font-bold mb-4 text-gray-700">Update Vaccine Stock</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vaccine Name *
                      </label>
                      <input
                        type="text"
                        value={stockForm.vaccine_name}
                        onChange={(e) => setStockForm({ ...stockForm, vaccine_name: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., BCG, OPV-0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        value={stockForm.quantity}
                        onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
                        required
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
                  >
                    {loading ? 'Updating...' : 'Update Stock'}
                  </button>
                </form>

                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4 text-gray-700">Current Vaccine Stock</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Vaccine Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Total Quantity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {/* --- ADDED SAFETY CHECK --- */}
                        {Array.isArray(vaccineStock) && vaccineStock.length > 0 ? (
                          vaccineStock.map((vaccine, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">{vaccine.vaccine_name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{vaccine.total_quantity}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="2" className="px-6 py-4 text-center text-gray-500">
                              {loading ? 'Loading stock...' : 'No stock found.'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'assign' && (
              <form onSubmit={handleAssignVaccine} className="space-y-4">
                <h2 className="text-2xl font-bold mb-4 text-gray-700">Assign Vaccine to Staff</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Staff *
                    </label>
                    <select
                      value={assignForm.staffId}
                      onChange={(e) => setAssignForm({ ...assignForm, staffId: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select staff</option>
                      {staffList.map((staff) => (
                        <option key={staff._id} value={staff._id}>
                          {staff.name} ({staff.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vaccine Name *
                    </label>
                    <input
                      type="text"
                      value={assignForm.vaccine_name}
                      onChange={(e) => setAssignForm({ ...assignForm, vaccine_name: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., BCG"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={assignForm.quantity}
                      onChange={(e) => setAssignForm({ ...assignForm, quantity: e.target.value })}
                      required
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Vaccination *
                    </label>
                    <input
                      type="date"
                      value={assignForm.assigned_date}
                      onChange={(e) => setAssignForm({ ...assignForm, assigned_date: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
                >
                  {loading ? 'Assigning...' : 'Assign Vaccine'}
                </button>
              </form>
            )}

            {activeTab === 'wastage' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-700">Vaccine Usage Report</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Staff Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Vaccine</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Assigned</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Remaining</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Used</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Usage %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {/* --- ADDED SAFETY CHECK --- */}
                      {Array.isArray(staffList) && staffList.length > 0 ? (
                        staffList.map((staff) => {
                          const assigned = staff.assigned_vaccine?.assigned_quantity || 0;
                          const remaining = staff.assigned_vaccine?.remaining_quantity || 0;
                          const used = calculateUsed(staff);
                          const usagePercent = assigned > 0 ? ((used / assigned) * 100).toFixed(2) : 0;

                          return (
                            <tr key={staff._id}>
                              <td className="px-6 py-4 whitespace-nowrap">{staff.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {staff.assigned_vaccine?.vaccine_name || 'Not assigned'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{assigned}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{remaining}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{used}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{usagePercent}%</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                              {loading ? 'Loading staff...' : 'No staff found.'}
                            </td>
                          </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>{/* Assuming Footer is imported */}
    </div>
  );
};

export default AdminDashboard;