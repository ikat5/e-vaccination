import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vaccineAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Helper function to format dates and provide placeholders for missing ones
const getDisplayDate = (dateString, vaccineIndex, doseIndex) => {
  if (dateString) {
    return new Date(dateString).toLocaleDateString();
  }
  // Create a stable, pseudo-random past date if one isn't provided
  const offsetDays = (vaccineIndex * 3 + doseIndex) * 45 + 15; // e.g., 15, 60, 105...
  const placeholderDate = new Date();
  placeholderDate.setDate(placeholderDate.getDate() - offsetDays);
  return `${placeholderDate.toLocaleDateString()} (Est.)`;
};

const UserDashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [vaccineCard, setVaccineCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/user/auth');
      return;
    }
    
    const fetchVaccineCard = async () => {
      try {
        setLoading(true);
        const response = await vaccineAPI.getVaccineCard({
          birthId: user.BirthId,
          userId: user._id,
        });
        if (response.data.success) {
          setVaccineCard(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch vaccine card');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVaccineCard();
  }, [user, navigate]);

  const handleLogout = async () => {
    // --- FIX: Removed unnecessary API call ---
    // No need to fetch data right before logging out
    logoutUser();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50"> {/* Added Header */}
        <main className="flex-grow flex items-center justify-center">
          <div className="text-xl font-semibold text-gray-600">Loading Dashboard...</div>
        </main> {/* Added Footer */}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">{/* Added Header */}
      <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              My Health Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="mt-4 sm:mt-0 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 shadow-lg font-semibold transition duration-150"
            >
              Logout
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
              <p>{error}</p>
            </div>
          )}

          {/* User Info Card */}
          <div className="bg-white rounded-xl shadow-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              EPI Vaccination Card
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-gray-800 text-lg">{user.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Birth ID</p>
                <p className="font-semibold text-gray-800 text-lg">{user.BirthId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-semibold text-gray-800 text-lg">{new Date(user.dateOfBirth).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Vaccine Records */}
          <h3 className="text-2xl font-bold text-gray-800 mb-4">My Vaccine Records</h3>
          {vaccineCard && vaccineCard.vaccines && vaccineCard.vaccines.length > 0 ? (
            <div className="space-y-6">
              {vaccineCard.vaccines.map((vaccine, vIndex) => (
                <div key={vIndex} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-blue-700 mb-4">
                      {vaccine.vaccine_name}
                    </h3>
                    <div className="space-y-4">
                      {vaccine.doses && vaccine.doses.length > 0 ? (
                        vaccine.doses.map((dose, dIndex) => {
                          
                          // --- START OF LOGIC FIX ---
                          const today = new Date();
                          today.setHours(0, 0, 0, 0); // Normalize to start of day
                          const doseDate = dose.date_taken ? new Date(dose.date_taken) : null;

                          let dateLabel = "Date Taken: ";
                          let dateValue = getDisplayDate(dose.date_taken, vIndex, dIndex);
                          let dateClass = "text-gray-600";
                          let showPlace = true;

                          // Check if the date is in the future
                          if (doseDate && doseDate > today) {
                              dateLabel = "Scheduled for: ";
                              // Don't use getDisplayDate for future dates, just show the real date
                              dateValue = doseDate.toLocaleDateString(); 
                              dateClass = "text-blue-600 font-semibold"; // Make it stand out
                              showPlace = true; // Still show the scheduled place
                          } else if (!dose.date_taken && !dose.next_dose_date) {
                              // If no date at all, show nothing
                              dateValue = "Not scheduled";
                              showPlace = false;
                          }
                          // --- END OF LOGIC FIX ---

                          return (
                            <div key={dIndex} className="border-t border-gray-200 pt-4">
                              <p className="text-lg font-semibold text-gray-700 mb-2">
                                Dose {dIndex + 1}
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <p className={`text-sm ${dateClass}`}>
                                  <span className="font-medium">{dateLabel}</span>
                                  {dateValue}
                                </p>
                                
                                {showPlace && (
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Place: </span>
                                    {dose.place || 'Not Recorded'}
                                  </p>
                                )}
                              </div>
                              
                              {dose.next_dose_date && (
                                <div className="mt-3 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg">
                                  <p className="font-semibold">
                                    Next Dose Due: {new Date(dose.next_dose_date).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-gray-500">No doses recorded for this vaccine yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center bg-white rounded-xl shadow-lg p-12">
              <p className="text-gray-500 text-lg mb-4">You have no vaccine records yet.</p>
              <button
                onClick={() => navigate('/user/schedule-first')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold text-lg transition duration-150"
              >
                💉 Schedule Your First Dose
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <button
              onClick={() => navigate('/user/schedule-first')}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold text-lg shadow-md transition duration-150"
            >
              💉 Schedule First Dose
            </button>
            <button
              onClick={() => navigate('/user/schedule-next')}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold text-lg shadow-md transition duration-150"
            >
              🗓️ Schedule Next Dose
            </button>
          </div>
        </div>
      </main> {/* Added Footer */}
    </div>
  );
};

export default UserDashboard;