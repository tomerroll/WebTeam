import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { fetchTheoryContent } from '../../services/theoryService';

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
    const loadTheory = async () => {
      try {
        const data = await fetchTheoryContent();
        setTheoryContent(data);
      } catch (err) {
        console.error('שגיאה בטעינת תיאוריה:', err);
      }
    };
  
    loadTheory();
  }, []);
  

  const toggleContent = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">תיאוריה</h2>

          <div className="space-y-6">
            {theoryContent.map((content) => (
              <div key={content._id} className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{content.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">{content.description}</p>

                  {expandedItems[content._id] && (
                    <div className="mt-4">
                      <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">{content.content}</p>
                    </div>
                  )}

                  <div className="mt-4">
                    <button
                      onClick={() => toggleContent(content._id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 dark:text-primary-200 bg-primary-100 dark:bg-primary-900 hover:bg-primary-200 dark:hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
