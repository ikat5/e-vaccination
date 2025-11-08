import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Import adminAPI to fetch stock for places
import { vaccineAPI, adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ScheduleNextDose = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vaccine_name: '',
    next_dose_date: '',
    place: '',
  });
  const [vaccineList, setVaccineList] = useState([]); // User's eligible vaccines
  const [availablePlaces, setAvailablePlaces] = useState([]); // Places from admin stock
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/user/auth');
      return;
    }

    // Fetch user's vaccine card for eligible vaccines
    const fetchVaccineCard = async () => {
      try {
        const response = await vaccineAPI.getVaccineCard({
          birthId: user.BirthId,
          userId: user._id,
        });
        if (response.data.success && response.data.data.vaccines) {
          const vaccinesWithNextDose = response.data.data.vaccines
            .filter((vaccine) => 
              vaccine.doses && vaccine.doses.some((dose) => dose.next_dose_date)
            )
            .map((v) => v.vaccine_name);
          
          setVaccineList(vaccinesWithNextDose);
        }
      } catch (err) {
        setError('Failed to fetch vaccine information');
      }
    };

    // Fetch all available vaccination centers/places from admin stock
    const fetchAvailablePlaces = async () => {
      try {
        const response = await adminAPI.getStock({});
        if (response.data && response.data.stock) {
          // Assuming stock items have a 'place' field
          const uniquePlaces = [
            ...new Set(response.data.stock.map((item) => item.place)),
          ];
          setAvailablePlaces(uniquePlaces);
        }
      } catch (err) {
        setError('Failed to fetch vaccination centers. Please try again later.');
        console.error(err);
      }
    };

    fetchVaccineCard();
    fetchAvailablePlaces();
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
      const response = await vaccineAPI.scheduleNextDose({
        birthId: user.BirthId,
        userId: user._id,
        ...formData,
      });
      if (response.data.success) {
        setSuccess('Next dose scheduled successfully! Redirecting...');
        setTimeout(() => {
          navigate('/user/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule next dose');
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
              🗓️ Schedule Next Dose
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

            {vaccineList.length === 0 && !loading ? (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 px-4 py-3 rounded mb-4">
                <p>No vaccines with pending next doses found. You may need to schedule a first dose or wait for the appropriate time.</p>
              </div>
            ) : (
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-150"
                  >
                    <option value="">Select a vaccine for the next dose</option>
                    {vaccineList.map((vaccine, index) => (
                      <option key={index} value={vaccine}>
                        {vaccine}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    name="next_dose_date"
                    value={formData.next_dose_date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-150"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Place/Location *
                  </label>
                  <select
                    name="place"
                    value={formData.place}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-150"
                  >
                    <option value="">Select a vaccination center</option>
                     {availablePlaces.length > 0 ? (
                      availablePlaces.map((place, index) => (
                        <option key={index} value={place}>
                          {place}
                        </option>
                      ))
                    ) : (
                      <option disabled>Loading centers...</option>
                    )}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold transition duration-150"
                  >
                    {loading ? 'Scheduling...' : 'Schedule Next Dose'}
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScheduleNextDose;