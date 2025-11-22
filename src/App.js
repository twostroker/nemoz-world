import React, { useState, useEffect } from 'react';
import { Instagram, Youtube, Trash2, LogOut, Plus, X, Edit } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// ========================================
// REPLACE THESE WITH YOUR SUPABASE VALUES
// ========================================
const SUPABASE_URL = 'https://znalxczzlwqejkqccqip.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuYWx4Y3p6bHdxZWprcWNjcWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MTMxNzYsImV4cCI6MjA3OTI4OTE3Nn0._at6xWokLR5QETHOQPVYPm3jWBwxdrRqxYnDI3g-y58';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const NemozWorld = () => {
  const [works, setWorks] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [editingWork, setEditingWork] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState(null);
  const [newWork, setNewWork] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    type: 'image'
  });

  const ADMIN_PASSWORD = 'nemoz2025';
  const INSTAGRAM_HANDLE = 'crazy_.craftzy';
  const YOUTUBE_CHANNEL = '@nemoz-k6q';

  // Fetch works from Supabase
  const fetchWorks = async () => {
    setLoading(true);
   const { data, error } = await supabase
  .from('works')
  .select('*')
  .order('created_at', { ascending: false });

if (error) {
  console.error('Error fetching works:', error);
} else {
  setWorks(data || []);
}
    setLoading(false);
  };

  useEffect(() => {
    fetchWorks();

    // Check if URL has a product ID
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    if (productId) {
      const fetchProduct = async () => {
        const { data } = await supabase
          .from('works')
          .select('*')
          .eq('id', productId)
          .single();
        if (data) {
          setSelectedProduct(data);
        }
      };
      fetchProduct();
    }
  }, []);

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      alert('Incorrect password!');
    }
  };

  const handleAddWork = async () => {
    if (!newWork.title || !newWork.imageUrl) {
      alert('Please fill in at least the title and image URL');
      return;
    }

    const { data, error } = await supabase
      .from('works')
      .insert([
        {
          title: newWork.title,
          description: newWork.description,
          price: newWork.price,
          image_url: newWork.imageUrl,
          type: newWork.type
        }
      ])
      .select();

    if (error) {
  console.error('Error adding work:', error);
  console.log('Full error details:', JSON.stringify(error, null, 2));
  alert('Failed to add work. Please try again.');
} else {
      await fetchWorks();
      setNewWork({
        title: '',
        description: '',
        price: '',
        imageUrl: '',
        type: 'image'
      });
      alert('Work added successfully!');
    }
  };

  const handleDeleteWork = async (id) => {
    if (window.confirm('Are you sure you want to delete this work?')) {
      const { error } = await supabase
        .from('works')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting work:', error);
        alert('Failed to delete work.');
      } else {
        await fetchWorks();
      }
    }
  };

  const handleEditWork = (work) => {
    setEditingWork({
      id: work.id,
      title: work.title,
      description: work.description,
      price: work.price,
      imageUrl: work.image_url,
      type: work.type
    });
  };

  const handleUpdateWork = async () => {
    if (!editingWork.title || !editingWork.imageUrl) {
      alert('Please fill in at least the title and image URL');
      return;
    }

    const { error } = await supabase
      .from('works')
      .update({
        title: editingWork.title,
        description: editingWork.description,
        price: editingWork.price,
        image_url: editingWork.imageUrl,
        type: editingWork.type
      })
      .eq('id', editingWork.id);

    if (error) {
      console.error('Error updating work:', error);
      alert('Failed to update work.');
    } else {
      await fetchWorks();
      setEditingWork(null);
      alert('Work updated successfully!');
    }
  };

  const handleCancelEdit = () => {
    setEditingWork(null);
  };

const handleOrder = (work) => {
  const productUrl = `${window.location.origin}?product=${work.id}`;
  const message = `Hi! I want to order: ${work.title}\n\nProduct Link: ${productUrl}`;
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://instagram.com/${INSTAGRAM_HANDLE}?text=${encodedMessage}`, '_blank');
};

const handleFooterClick = () => {
  if (isAdmin) return;
  
  setClickCount(prev => prev + 1);
  
  if (clickTimer) {
    clearTimeout(clickTimer);
  }
  
  const timer = setTimeout(() => {
    setClickCount(0);
  }, 2000);
  
  setClickTimer(timer);
  
  if (clickCount + 1 === 4) {
    setShowAdminLogin(true);
    setClickCount(0);
    if (clickTimer) {
      clearTimeout(clickTimer);
    }
  }
};
  return (
    <div className="min-h-screen bg-black pb-24">
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .gradient-animate {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .hover-scale {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-scale:hover {
          transform: scale(1.05);
        }

        .image-hover {
          position: relative;
          overflow: hidden;
        }

        .image-hover img,
        .image-hover video {
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .image-hover:hover img,
        .image-hover:hover video {
          transform: scale(1.1);
        }
      `}</style>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">NEMOZ WORLD</h1>
            <p className="text-sm text-gray-400 font-medium">Handcrafted Art & Creative Designs</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setIsAdmin(false)}
              className="px-4 py-2 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2 border border-gray-700"
            >
              <LogOut size={18} /> Logout
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 gradient-animate">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-6xl font-black text-white mb-4 tracking-tight">Art That Speaks</h2>
          <p className="text-2xl text-white font-medium opacity-90">Explore unique handcrafted pieces</p>
        </div>
      </header>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowAdminLogin(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-black mb-6">Admin Login</h2>
            <input
              type="password"
              placeholder="Enter password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-purple-600 text-lg"
            />
            <div className="flex gap-3">
              <button
                onClick={handleAdminLogin}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition-all"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setShowAdminLogin(false);
                  setAdminPassword('');
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full relative border border-gray-800 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 bg-black bg-opacity-50 rounded-full p-2"
            >
              <X size={24} />
            </button>
            
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="image-hover rounded-xl overflow-hidden">
                {selectedProduct.type === 'video' ? (
                  <video
                    src={selectedProduct.image_url}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div className="flex flex-col">
                <h2 className="text-4xl font-black text-white mb-4">{selectedProduct.title}</h2>
                {selectedProduct.price && (
                  <p className="text-3xl font-black text-purple-400 mb-6">{selectedProduct.price}</p>
                )}
                {selectedProduct.description && (
                  <p className="text-gray-300 text-lg leading-relaxed mb-8">{selectedProduct.description}</p>
                )}
                
                <button
                  onClick={() => handleOrder(selectedProduct)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-black text-lg hover:opacity-90 transition-all mt-auto"
                >
                  Order on Instagram
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Work Modal */}
      {editingWork && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full relative border border-gray-800">
            <button
              onClick={handleCancelEdit}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-black text-white mb-6">Edit Work</h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Title"
                value={editingWork.title}
                onChange={(e) => setEditingWork({...editingWork, title: e.target.value})}
                className="px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-purple-600"
              />
              
              <input
                type="text"
                placeholder="Price"
                value={editingWork.price}
                onChange={(e) => setEditingWork({...editingWork, price: e.target.value})}
                className="px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-purple-600"
              />
            </div>

            <textarea
              placeholder="Description"
              value={editingWork.description}
              onChange={(e) => setEditingWork({...editingWork, description: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg mb-4 focus:outline-none focus:border-purple-600"
              rows="3"
            />

            <input
              type="text"
              placeholder="Image/Video URL"
              value={editingWork.imageUrl}
              onChange={(e) => setEditingWork({...editingWork, imageUrl: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg mb-4 focus:outline-none focus:border-purple-600"
            />

            <div className="flex gap-6 mb-6">
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="radio"
                  value="image"
                  checked={editingWork.type === 'image'}
                  onChange={(e) => setEditingWork({...editingWork, type: e.target.value})}
                  className="w-5 h-5"
                />
                <span className="font-medium">Image</span>
              </label>
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="radio"
                  value="video"
                  checked={editingWork.type === 'video'}
                  onChange={(e) => setEditingWork({...editingWork, type: e.target.value})}
                  className="w-5 h-5"
                />
                <span className="font-medium">Video</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpdateWork}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition-all"
              >
                Update Work
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-bold hover:bg-gray-700 transition-all border border-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Admin Panel */}
        {isAdmin && (
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 mb-16 border border-gray-800">
            <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
              <Plus size={32} className="text-purple-500" />
              Add New Work
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Title"
                value={newWork.title}
                onChange={(e) => setNewWork({...newWork, title: e.target.value})}
                className="px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-purple-600"
              />
              
              <input
                type="text"
                placeholder="Price"
                value={newWork.price}
                onChange={(e) => setNewWork({...newWork, price: e.target.value})}
                className="px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-purple-600"
              />
            </div>

            <textarea
              placeholder="Description"
              value={newWork.description}
              onChange={(e) => setNewWork({...newWork, description: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg mb-4 focus:outline-none focus:border-purple-600"
              rows="3"
            />

            <input
              type="text"
              placeholder="Image/Video URL"
              value={newWork.imageUrl}
              onChange={(e) => setNewWork({...newWork, imageUrl: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg mb-4 focus:outline-none focus:border-purple-600"
            />

            <div className="flex gap-6 mb-6">
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="radio"
                  value="image"
                  checked={newWork.type === 'image'}
                  onChange={(e) => setNewWork({...newWork, type: e.target.value})}
                  className="w-5 h-5"
                />
                <span className="font-medium">Image</span>
              </label>
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="radio"
                  value="video"
                  checked={newWork.type === 'video'}
                  onChange={(e) => setNewWork({...newWork, type: e.target.value})}
                  className="w-5 h-5"
                />
                <span className="font-medium">Video</span>
              </label>
            </div>

            <button
              onClick={handleAddWork}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-black text-lg hover:opacity-90 transition-all"
            >
              Add Work
            </button>
          </div>
        )}

        {/* Gallery Section */}
        <div>
          <h2 className="text-5xl font-black text-white mb-12 text-center">Latest Works</h2>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
              <p className="text-gray-400 mt-4">Loading works...</p>
            </div>
          ) : works.length === 0 ? (
            <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800">
              <p className="text-gray-400 text-xl">No works yet. {isAdmin && 'Start by adding your first creation!'}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {works.map((work, index) => (
                <div 
                  key={work.id} 
                  className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover-scale fade-in-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="image-hover">
                    {work.type === 'video' ? (
                      <video
                        src={work.image_url}
                        controls
                        className="w-full h-72 object-cover"
                      />
                    ) : (
                      <img
                        src={work.image_url}
                        alt={work.title}
                        className="w-full h-72 object-cover"
                      />
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-2xl font-black text-white">{work.title}</h3>
                      {work.price && (
                        <span className="text-xl font-black text-purple-400">{work.price}</span>
                      )}
                    </div>
                    
                    {work.description && (
                      <p className="text-gray-400 mb-6 leading-relaxed">{work.description}</p>
                    )}
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleOrder(work)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition-all"
                      >
                        Order Now
                      </button>
                      
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleEditWork(work)}
                            className="px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteWork(work.id)}
                            className="px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                          >
                            <Trash2 size={20} />
                          </button>
                        </>
                      )}
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          const productUrl = `${window.location.origin}?product=${work.id}`;
                          navigator.clipboard.writeText(productUrl);
                          alert('Product link copied to clipboard!');
                        }}
                        className="w-full mt-2 text-sm text-gray-400 hover:text-purple-400 transition-colors"
                      >
                        Copy Product Link
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t border-gray-800 py-6 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-8">
              <a
                href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white hover:text-pink-400 transition-colors font-semibold text-lg"
              >
                <Instagram size={28} />
                <span>Instagram</span>
              </a>
              
              <a
                href={`https://youtube.com/${YOUTUBE_CHANNEL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white hover:text-red-400 transition-colors font-semibold text-lg"
              >
                <Youtube size={28} />
                <span>YouTube</span>
              </a>
            </div>
            
            <div className="text-right">
              <p 
  onClick={handleFooterClick}
  className="text-gray-400 font-medium cursor-pointer select-none"
>
  with love, zoro
</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NemozWorld;