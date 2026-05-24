import { useState, useEffect } from 'react';
import { useGlobal, Address } from '../context/GlobalContext';
import { Package, MapPin, User, LogOut, ChevronRight, CircleCheckBig, Clock, ShoppingBag } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

type Tab = 'profile' | 'orders' | 'addresses';

export default function Account() {
  const { user, logout, orders, addresses, updateProfile, addAddress, deleteAddress, fetchOrders } = useGlobal();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('orders');

  // Profile Form State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePassword, setProfilePassword] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    firstName: '', lastName: '', street: '', city: '', zipCode: '', phone: ''
  });

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      fetchOrders();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl font-semibold text-zinc-950 mb-4">Account Access Required</h2>
        <p className="text-sm text-zinc-500 mb-8">Please sign in to view your profile, track orders, and manage addresses.</p>
        <button 
          onClick={() => navigate('/')} 
          className="px-6 py-3 bg-zinc-950 text-white font-medium text-xs tracking-wider uppercase rounded-lg hover:bg-zinc-850 cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const payload: any = { name: profileName };
      if (profilePassword) payload.password = profilePassword;
      await updateProfile(payload);
      setProfilePassword('');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress(newAddress);
    setShowAddressForm(false);
    setNewAddress({ firstName: '', lastName: '', street: '', city: '', zipCode: '', phone: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-rose-50/30 border border-rose-100 rounded-2xl p-6">
            <div className="w-16 h-16 rounded-full bg-amber-700 text-white flex items-center justify-center text-2xl font-serif mb-4">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="font-serif text-xl font-bold text-zinc-900">{user.name}</h2>
            <p className="text-xs text-zinc-500">{user.email}</p>
          </div>

          <nav className="flex flex-col space-y-1">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center justify-between p-3 text-sm font-semibold rounded-lg cursor-pointer ${activeTab === 'profile' ? 'text-amber-800 bg-amber-50/50' : 'text-zinc-600 hover:text-amber-800 hover:bg-zinc-50'}`}
            >
              <span className="flex items-center"><User className="w-4 h-4 mr-2" /> Profile Details</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'profile' ? 'rotate-90' : ''}`} />
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`flex items-center justify-between p-3 text-sm font-semibold rounded-lg cursor-pointer ${activeTab === 'orders' ? 'text-amber-800 bg-amber-50/50' : 'text-zinc-600 hover:text-amber-800 hover:bg-zinc-50'}`}
            >
              <span className="flex items-center"><Package className="w-4 h-4 mr-2" /> Order History</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'orders' ? 'rotate-90' : ''}`} />
            </button>
            <button 
              onClick={() => setActiveTab('addresses')}
              className={`flex items-center justify-between p-3 text-sm font-semibold rounded-lg cursor-pointer ${activeTab === 'addresses' ? 'text-amber-800 bg-amber-50/50' : 'text-zinc-600 hover:text-amber-800 hover:bg-zinc-50'}`}
            >
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> Saved Addresses</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'addresses' ? 'rotate-90' : ''}`} />
            </button>
            <button onClick={handleLogout} className="flex items-center justify-between p-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg mt-4 cursor-pointer">
              <span className="flex items-center"><LogOut className="w-4 h-4 mr-2" /> Sign Out</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-zinc-900 mb-6">Profile Details</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Email Address (Cannot be changed)</label>
                  <p className="text-zinc-900 font-medium p-3 bg-zinc-50 rounded-lg border border-zinc-100">{user.email}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Full Name</label>
                  <input type="text" value={profileName} onChange={e => setProfileName(e.target.value)} className="w-full text-zinc-900 font-medium p-3 rounded-lg border border-zinc-200 focus:outline-none focus:border-amber-700" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">New Password (Leave blank to keep current)</label>
                  <input type="password" value={profilePassword} onChange={e => setProfilePassword(e.target.value)} className="w-full text-zinc-900 font-medium p-3 rounded-lg border border-zinc-200 focus:outline-none focus:border-amber-700" />
                </div>
                <button type="submit" disabled={isUpdatingProfile} className="px-6 py-3 bg-zinc-950 text-white font-medium text-xs tracking-wider uppercase rounded-lg hover:bg-zinc-850 cursor-pointer disabled:bg-zinc-400 mt-4">
                  {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
                <h3 className="font-serif text-xl font-bold text-zinc-900">Order History</h3>
                <span className="text-xs font-medium text-zinc-500">{orders.length} Orders</span>
              </div>
              
              {orders.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-zinc-50 mx-auto flex items-center justify-center mb-4">
                    <ShoppingBag className="w-6 h-6 text-zinc-400" />
                  </div>
                  <h4 className="text-lg font-bold text-zinc-900 mb-2">No orders yet</h4>
                  <p className="text-sm text-zinc-500 mb-6 max-w-sm mx-auto">When you place an order, it will appear here so you can track its status.</p>
                  <Link to="/shop" className="inline-block px-6 py-2.5 bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-zinc-800 transition-colors">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {orders.map((order, i) => (
                    <div key={i} className="p-6 hover:bg-zinc-50/30 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <p className="text-sm font-bold text-zinc-900">Order #{order.id.substring(0, 8).toUpperCase()}</p>
                          <p className="text-xs text-zinc-500 mt-1">Placed on {order.date}</p>
                        </div>
                        <div className="flex flex-col sm:items-end gap-2">
                          <span className="font-semibold text-zinc-900">₹{order.total.toFixed(2)}</span>
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-sm flex items-center ${
                            order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.status === 'Delivered' ? <CircleCheckBig className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-zinc-50 rounded-lg p-4 flex gap-4 overflow-x-auto">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex-shrink-0 flex items-center gap-3 pr-4 border-r border-zinc-200 last:border-0">
                            <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 object-cover rounded-md border border-zinc-200" />
                            <div>
                              <p className="text-xs font-bold text-zinc-900 line-clamp-1 max-w-[150px]">{item.product.name}</p>
                              <p className="text-[10px] text-zinc-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
                <h3 className="font-serif text-xl font-bold text-zinc-900">Saved Addresses</h3>
                <button onClick={() => setShowAddressForm(!showAddressForm)} className="text-xs font-semibold text-amber-700 hover:text-amber-800 uppercase tracking-wider cursor-pointer">
                  {showAddressForm ? 'Cancel' : '+ Add New'}
                </button>
              </div>
              
              {showAddressForm && (
                <div className="p-6 border-b border-zinc-200 bg-zinc-50">
                  <h4 className="font-bold text-sm mb-4">Add New Address</h4>
                  <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name" required value={newAddress.firstName} onChange={e => setNewAddress({...newAddress, firstName: e.target.value})} className="p-2 text-sm border border-zinc-200 rounded focus:border-amber-700" />
                    <input type="text" placeholder="Last Name" required value={newAddress.lastName} onChange={e => setNewAddress({...newAddress, lastName: e.target.value})} className="p-2 text-sm border border-zinc-200 rounded focus:border-amber-700" />
                    <input type="text" placeholder="Phone" required value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="p-2 text-sm border border-zinc-200 rounded focus:border-amber-700" />
                    <input type="text" placeholder="ZIP Code" required value={newAddress.zipCode} onChange={e => setNewAddress({...newAddress, zipCode: e.target.value})} className="p-2 text-sm border border-zinc-200 rounded focus:border-amber-700" />
                    <input type="text" placeholder="Street Address" required value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="p-2 text-sm border border-zinc-200 rounded focus:border-amber-700 sm:col-span-2" />
                    <input type="text" placeholder="City" required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="p-2 text-sm border border-zinc-200 rounded focus:border-amber-700 sm:col-span-2" />
                    <button type="submit" className="sm:col-span-2 py-2.5 bg-zinc-950 text-white font-bold text-xs uppercase rounded cursor-pointer hover:bg-zinc-800">Save Address</button>
                  </form>
                </div>
              )}

              {addresses.length === 0 && !showAddressForm ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-zinc-50 mx-auto flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-zinc-400" />
                  </div>
                  <h4 className="text-lg font-bold text-zinc-900 mb-2">No saved addresses</h4>
                  <p className="text-sm text-zinc-500">Addresses used during checkout will automatically be saved here.</p>
                </div>
              ) : (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr, index) => (
                    <div key={index} className={`border rounded-xl p-5 relative ${addr.isDefault ? 'border-amber-200 bg-amber-50/30' : 'border-zinc-200'}`}>
                      {addr.isDefault && (
                        <span className="absolute top-4 right-4 text-[9px] uppercase font-bold tracking-widest text-amber-700 bg-amber-100 px-2 py-1 rounded">Default</span>
                      )}
                      <p className="font-bold text-sm text-zinc-900">{addr.firstName} {addr.lastName}</p>
                      <p className="text-xs text-zinc-600 mt-2">{addr.street}</p>
                      <p className="text-xs text-zinc-600 mt-0.5">{addr.city}, {addr.zipCode}</p>
                      <p className="text-xs text-zinc-600 mt-0.5">Phone: {addr.phone}</p>
                      
                      <div className="mt-4 flex gap-3">
                        <button className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-amber-700 cursor-pointer">Edit</button>
                        {!addr.isDefault && (
                          <button onClick={() => deleteAddress(addr._id!)} className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-red-600 cursor-pointer">Delete</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
