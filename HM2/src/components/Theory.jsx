import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Theory = () => {
  const navigate = useNavigate();
  const [theoryContent, setTheoryContent] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // שליפת שם משתמש מלוקל סטרוג'
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.name) {
      setUserName(storedUser.name);
    }
  }, []);

  useEffect(() => {
    const fetchTheoryContent = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/theory');
        const data = await res.json();
        setTheoryContent(data);
      } catch (err) {
        console.error('Error fetching theory content:', err);
      }
    };

    fetchTheoryContent();
  }, []);

  const toggleContent = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <h1
                className="text-xl font-bold text-primary-600 cursor-pointer"
                onClick={() => window.location.href = '/student-dashboard'}
              >
                MathDuo
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate('/');
                }}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                התנתק
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">תיאוריה</h2>

          <div className="space-y-6">
            {theoryContent.map((content) => (
              <div key={content._id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">{content.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{content.description}</p>

                  {expandedItems[content._id] && (
                    <div className="mt-4">
                      <p className="text-gray-700 whitespace-pre-line">{content.content}</p>
                    </div>
                  )}

                  <div className="mt-4">
                    <button
                      onClick={() => toggleContent(content._id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      {expandedItems[content._id] ? 'הסתר' : 'קרא עוד'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Theory;
