import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vaccineAPI, adminAPI } from '../../services/api'; 
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ScheduleFirstDose = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vaccine_name: '',
    date_taken: '',
    place: '',
  });
  const [vaccineList, setVaccineList] = useState([]); // Will be populated from API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [listLoading, setListLoading] = useState(true); // Separate loading for the list

  useEffect(() => {
    if (!user) {
      navigate('/user/auth');
      return;
    }

    const fetchAvailableVaccines = async () => {
      try {
        setListLoading(true);
        const response = await adminAPI.getStock({}); 
        
        // --- THIS IS THE FIX ---
        // We must check for response.data.data.stock,
        // just like we fixed in the AdminDashboard.
        const stockData = response.data?.data?.stock; // Use optional chaining

        if (Array.isArray(stockData)) {
          // Create a unique list of vaccine names from the stock
          const uniqueVaccines = [
            ...new Set(stockData.map((item) => item.vaccine_name)),
          ];
          setVaccineList(uniqueVaccines);
        } else {
          // Handle cases where 'stock' might be missing
          setVaccineList([]);
          console.warn("Response from adminAPI.getStock() did not contain a 'data.stock' array.");
        }
        // --- END OF FIX ---

      } catch (err) {
        setError('Failed to fetch available vaccines. Please try again later.');
        console.error(err);
      } finally {
        setListLoading(false);
      }
    };

    fetchAvailableVaccines();
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await vaccineAPI.scheduleFirstDose({
        birthId: user.BirthId,
        userId: user._id,
        ...formData,
      });
      if (response.data.success) {
        setSuccess('First dose scheduled successfully! Redirecting...');
        setTimeout(() => {
          navigate('/user/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule first dose');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden p-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
              💉 Schedule First Dose
            </h2>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-4">
                <p>{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vaccine Name *
                </label>
                <select
                  name="vaccine_name"
                  value={formData.vaccine_name}
                  onChange={handleChange}
                  required
                  disabled={listLoading || vaccineList.length === 0} // This will no longer be disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-150 disabled:bg-gray-100"
                >
                  <option value="">
                    {listLoading ? 'Loading vaccines...' : 'Select a vaccine'}
                  </option>
                  {!listLoading && vaccineList.length > 0 ? (
                    vaccineList.map((vaccine, index) => (
                      <option key={index} value={vaccine}>
                        {vaccine}
                      </option>
                    ))
                  ) : (
                    !listLoading && <option disabled>No vaccines available</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date_taken"
                  value={formData.date_taken}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-150"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Place/Location *
                </label>
                <input
                  type="text"
                  name="place"
                  value={formData.place}
                  onChange={handleChange}
                  required
                  placeholder="Enter vaccination center name or location"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-150"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading || listLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold transition duration-150"
                >
                  {loading ? 'Scheduling...' : 'Schedule Dose'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/user/dashboard')}
                  className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 font-semibold transition duration-150"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScheduleFirstDose;