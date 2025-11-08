import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { staffAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Helper to format date for input[type=date]
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (e) {
    return '';
  }
};

const StaffDashboard = () => {
  const { staff, logoutStaff } = useAuth();
  const navigate = useNavigate();
  const [assignedVaccine, setAssignedVaccine] = useState(null);
  const [userData, setUserData] = useState(null);
  const [searchBirthId, setSearchBirthId] = useState('');
  const [administerForm, setAdministerForm] = useState({
    birthId: '',
    vaccine_name: '',
    date_taken: '',
    place: '',
    next_dose_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!staff) {
      navigate('/staff/login');
      return;
    }
    fetchAssignedVaccine();
  }, [staff, navigate]);

  const fetchAssignedVaccine = async () => {
    try {
      const response = await staffAPI.getAssignedVaccine({ staffId: staff._id });
      if (response.data.success) {
        const data = response.data.data;
        setAssignedVaccine(data);
        
        // --- MODIFIED BLOCK ---
        // Pre-fill the form with assigned vaccine name AND date
        setAdministerForm((prev) => ({
          ...prev,
          vaccine_name: data.vaccine_name || '',
          date_taken: formatDateForInput(data.assigned_date) || '', // Pre-fill date
        }));
        // --- END OF MODIFIED BLOCK ---
      }
    } catch (err) {
      setError('Failed to fetch assigned vaccine information');
    }
  };

  const handleSearchUser = async (e) => {
    e.preventDefault();
    setError('');
    setUserData(null);
    setLoading(true);

    try {
      const response = await staffAPI.getUserByBirthId({
        birthId: searchBirthId,
        staffId: staff._id,
      });
      if (response.data.success) {
        setUserData(response.data.data);
        setAdministerForm((prev) => ({
          ...prev,
          birthId: searchBirthId,
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'User not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAdministerVaccine = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Ensure next_dose_date is null if empty
    const formData = {
      ...administerForm,
      next_dose_date: administerForm.next_dose_date || null,
    };

    try {
      const response = await staffAPI.administerVaccine({
        ...formData,
        staffId: staff._id,
      });
      if (response.data.success) {
        setSuccess('Vaccine administered successfully!');
        setAdministerForm({
          birthId: '',
          vaccine_name: assignedVaccine?.vaccine_name || '',
          date_taken: formatDateForInput(assignedVaccine?.assigned_date) || '', // Reset to default
          place: '',
          next_dose_date: '',
        });
        setUserData(null);
        setSearchBirthId('');
        fetchAssignedVaccine(); // Refetch to update remaining quantity
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to administer vaccine');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await staffAPI.logout({ staffId: staff._id });
      logoutStaff();
      navigate('/');
    } catch (err) {
      logoutStaff();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Staff Dashboard</h1>
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

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-2xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Assigned Vaccine</h2>
              {assignedVaccine ? (
                <div className="space-y-3">
                  <p className="text-gray-700 text-lg">
                    <span className="font-semibold">Vaccine:</span> {assignedVaccine.vaccine_name || 'Not assigned'}
                  </p>
                  
                  {/* */}
                  <p className="text-gray-700 text-lg">
                    <span className="font-semibold">Assigned Date:</span> 
                    {assignedVaccine.assigned_date 
                      ? new Date(assignedVaccine.assigned_date).toLocaleDateString() 
                      : 'Not set'}
                  </p>
                  {/* */}
                  
                  <p className="text-gray-700 text-lg">
                    <span className="font-semibold">Assigned Quantity:</span> {assignedVaccine.assigned_quantity || 0}
                  </p>
                  <p className="text-gray-700 text-lg">
                    <span className="font-semibold">Remaining Quantity:</span> {assignedVaccine.remaining_quantity || 0}
                  </p>
                  <p className="text-gray-700 text-lg">
                    <span className="font-semibold">Vaccinated Users:</span> {staff.vaccinated_users_count || 0}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">No vaccine assigned yet</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-2xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Search User</h2>
              <form onSubmit={handleSearchUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birth ID
                  </label>
                  <input
                    type="text"
                    value={searchBirthId}
                    onChange={(e) => setSearchBirthId(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter user's Birth ID"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
                >
                  {loading ? 'Searching...' : 'Search User'}
                </button>
              </form>
            </div>
          </div>

          {userData && (
            <div className="bg-white rounded-xl shadow-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">User Vaccination Card</h2>
              {/* User card details... (unchanged) */}
            </div>
          )}

          {userData && (
            <div className="bg-white rounded-xl shadow-2xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Administer Vaccine</h2>
              <form onSubmit={handleAdministerVaccine} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vaccine Name *
                  </label>
                  <input
                    type="text"
                    value={administerForm.vaccine_name}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>

                {/* --- MODIFIED THIS INPUT --- */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Taken *
                  </label>
                  <input
                    type="date"
                    value={administerForm.date_taken} // This is now pre-filled
                    onChange={(e) => setAdministerForm({ ...administerForm, date_taken: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* --- END OF MODIFICATION --- */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Place/Location *
                  </label>
                  <input
                    type="text"
                    value={administerForm.place}
                    onChange={(e) => setAdministerForm({ ...administerForm, place: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter vaccination center location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Next Dose Date (if applicable)
                  </label>
                  <input
                    type="date"
                    value={administerForm.next_dose_date}
                    onChange={(e) => setAdministerForm({ ...administerForm, next_dose_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !assignedVaccine || assignedVaccine.remaining_quantity === 0}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
                >
                  {loading ? 'Administering...' : 'Administer Vaccine'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;