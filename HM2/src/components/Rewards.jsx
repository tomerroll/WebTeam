import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Rewards = () => {
  const [rewards, setRewards] = useState([]);

  // הוספת מצב עבור המשתמש
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/rewards');
        const data = await res.json();
        setRewards(data);
      } catch (err) {
        console.error('Error fetching rewards:', err);
      }
    };

    fetchRewards();

    // טעינת המשתמש מ-localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
      }
    }
  }, []);

  const [studentRewards, setStudentRewards] = useState([
    {
      id: 1,
      studentName: 'ישראל ישראלי',
      totalPoints: 250,
      earnedRewards: [
        { rewardId: 1, earnedAt: '2024-03-15' },
        { rewardId: 2, earnedAt: '2024-03-14' },
      ],
    },
    {
      id: 2,
      studentName: 'שרה כהן',
      totalPoints: 175,
      earnedRewards: [
        { rewardId: 2, earnedAt: '2024-03-15' },
        { rewardId: 3, earnedAt: '2024-03-13' },
      ],
    },
    {
      id: 3,
      studentName: 'דוד לוי',
      totalPoints: 125,
      earnedRewards: [
        { rewardId: 3, earnedAt: '2024-03-14' },
      ],
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newReward, setNewReward] = useState({
    title: '',
    description: '',
    points: 0,
    icon: '🏆',
  });

  const handleAddReward = (e) => {
    e.preventDefault();
    const reward = {
      id: rewards.length + 1,
      ...newReward,
    };
    setRewards([...rewards, reward]);
    setShowAddForm(false);
    setNewReward({
      title: '',
      description: '',
      points: 0,
      icon: '🏆',
    });
  };

  const handleDeleteReward = (id) => {
    setRewards(rewards.filter(reward => reward.id !== id));
  };

  const getRewardDetails = (rewardId) => {
    return rewards.find(reward => reward.id === rewardId) || { title: 'לא נמצא', icon: '❓' };
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* כאן כל הלינקים בצד שמאל, קרובים אחד לשני */}
            <div className="flex items-center space-x-4">
              <Link to="/teacher-dashboard" className="text-primary-600 hover:text-primary-700">
                חזרה לדף הבית
              </Link>
              <h1>   </h1>
              {user && (
                <Link
                  to="/profile"
                  className="btn btn-ghost text-gray-600 hover:text-primary-700"
                >
                  שלום, {user.name}
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">מערכת תגמולים</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              הוסף תגמול
            </button>
          </div>

          {showAddForm && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">הוספת תגמול חדש</h3>
              <form onSubmit={handleAddReward} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">כותרת התגמול</label>
                  <input
                    type="text"
                    value={newReward.title}
                    onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">תיאור</label>
                  <textarea
                    value={newReward.description}
                    onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    rows="3"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">נקודות</label>
                    <input
                      type="number"
                      min="0"
                      value={newReward.points}
                      onChange={(e) => setNewReward({ ...newReward, points: parseInt(e.target.value) })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">אייקון</label>
                    <input
                      type="text"
                      value={newReward.icon}
                      onChange={(e) => setNewReward({ ...newReward, icon: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                  >
                    הוסף
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rewards.map((reward) => (
              <div key={reward.id || reward._id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">{reward.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{reward.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">התקדמות תלמידים</h3>
              <div className="space-y-4">
                {studentRewards.map((student) => (
                  <div key={student.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{student.studentName}</h4>
                      <span className="text-sm text-primary-600">{student.totalPoints} נקודות</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {student.earnedRewards.map((earnedReward) => {
                        const reward = getRewardDetails(earnedReward.rewardId);
                        return (
                          <div
                            key={earnedReward.rewardId}
                            className="flex items-center space-x-2 bg-white p-2 rounded-md"
                          >
                            <span>{reward.icon}</span>
                            <span className="text-sm text-gray-600">{reward.title}</span>
                            <span className="text-xs text-gray-400">{earnedReward.earnedAt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Rewards;
