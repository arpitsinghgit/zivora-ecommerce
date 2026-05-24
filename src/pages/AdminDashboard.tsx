import { useState, useEffect, useRef } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Package, ShoppingCart, CheckCircle, Trash2, Edit, Upload } from 'lucide-react';
import { Product } from '../data/products';

export default function AdminDashboard() {
  const { user, triggerToast } = useGlobal();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('orders');
  
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // New Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', price: 0, category: 'press-on', description: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      triggerToast('Not authorized', 'error');
    }
  }, [user, navigate, triggerToast]);

  const fetchData = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      if (activeTab === 'orders') {
        const data = await api.getAllOrders(user.token);
        setOrders(data);
      } else {
        const data = await api.getProducts();
        setProducts(data.products || data);
      }
    } catch (err: any) {
      triggerToast(err.message || 'Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, user]);

  const handleMarkShipped = async (orderId: string) => {
    if (!user?.token) return;
    try {
      await api.deliverOrder(orderId, user.token);
      triggerToast('Order marked as shipped!', 'success');
      fetchData(); // refresh
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!user?.token) return;
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.deleteProduct(productId, user.token);
      triggerToast('Product deleted!', 'success');
      fetchData();
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return;
    
    try {
      let imageUrl = 'https://images.unsplash.com/photo-1604654894610-df63bc536371'; // Default
      
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const res = await api.uploadImage(formData, user.token);
        imageUrl = res.imageUrl;
      }

      const productPayload = {
        ...newProduct,
        images: [imageUrl]
      };

      await api.createProduct(productPayload, user.token);
      triggerToast('Product created!', 'success');
      setShowAddForm(false);
      setImageFile(null);
      setNewProduct({ name: '', price: 0, category: 'press-on', description: '' });
      fetchData();
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-[70vh]">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-zinc-900">Admin Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your store, products, and orders.</p>
        </div>
      </div>

      <div className="flex space-x-4 border-b border-zinc-200 mb-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-2 text-sm font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'orders' ? 'border-b-2 border-amber-700 text-amber-800' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <ShoppingCart className="w-4 h-4 inline-block mr-2 -mt-1" />
          Orders
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-2 text-sm font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'products' ? 'border-b-2 border-amber-700 text-amber-800' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Package className="w-4 h-4 inline-block mr-2 -mt-1" />
          Products
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-700 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div>
          {activeTab === 'orders' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-600">
                <thead className="text-xs uppercase bg-zinc-50 text-zinc-700">
                  <tr>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="px-6 py-4 font-mono text-xs">{order._id}</td>
                      <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-bold">₹{order.totalPrice}</td>
                      <td className="px-6 py-4">
                        {order.isDelivered ? (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] rounded-full font-bold">SHIPPED</span>
                        ) : (
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] rounded-full font-bold">PENDING</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {!order.isDelivered && (
                          <button
                            onClick={() => handleMarkShipped(order._id)}
                            className="flex items-center text-xs font-bold text-emerald-600 hover:text-emerald-800 cursor-pointer"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" /> Mark Shipped
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-zinc-500">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-zinc-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded hover:bg-amber-700 transition cursor-pointer"
                >
                  {showAddForm ? 'Cancel' : '+ Add Product'}
                </button>
              </div>

              {showAddForm && (
                <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg mb-6">
                  <h3 className="font-bold text-sm mb-4">Create New Product</h3>
                  <form onSubmit={handleCreateProduct} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold mb-1">Product Name</label>
                        <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-2 border border-zinc-200 rounded text-xs" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">Price (₹)</label>
                        <input type="number" required min="0" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} className="w-full p-2 border border-zinc-200 rounded text-xs" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">Category</label>
                        <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full p-2 border border-zinc-200 rounded text-xs">
                          <option value="press-on">Press-On Nails</option>
                          <option value="polish">Gel Polish</option>
                          <option value="art-care">Care & Tools</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">Upload Image</label>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          accept="image/*"
                          onChange={e => setImageFile(e.target.files?.[0] || null)}
                          className="w-full p-1.5 border border-zinc-200 rounded text-xs bg-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold mb-1">Description</label>
                        <textarea required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full p-2 border border-zinc-200 rounded text-xs" rows={3}></textarea>
                      </div>
                    </div>
                    <button type="submit" className="flex items-center justify-center space-x-2 w-full py-2 bg-amber-700 text-white rounded text-xs font-bold uppercase cursor-pointer hover:bg-amber-800">
                      <Upload className="w-4 h-4" /> <span>Upload & Create Product</span>
                    </button>
                  </form>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-600">
                  <thead className="text-xs uppercase bg-zinc-50 text-zinc-700">
                    <tr>
                      <th className="px-6 py-3">Image</th>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Price</th>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id || (product as any)._id} className="border-b">
                        <td className="px-6 py-4">
                          <img src={product.image || (product.images && product.images[0])} alt={product.name} className="w-12 h-12 object-cover rounded border border-zinc-200" />
                        </td>
                        <td className="px-6 py-4 font-medium text-zinc-900">{product.name}</td>
                        <td className="px-6 py-4">₹{product.price}</td>
                        <td className="px-6 py-4">{product.category}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDeleteProduct(product.id || (product as any)._id)} className="text-zinc-400 hover:text-red-600 cursor-pointer" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
