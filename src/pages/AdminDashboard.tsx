import { useState, useEffect } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Package, ShoppingCart, CheckCircle, Trash2, Edit } from 'lucide-react';
import { Product } from '../data/products';

export default function AdminDashboard() {
  const { user, triggerToast } = useGlobal();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('orders');
  
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
        setProducts(data);
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

  const handleCreateDummyProduct = async () => {
    if (!user?.token) return;
    try {
      const newProduct = {
        name: 'New Zivora Collection',
        price: 999,
        category: 'press-on',
        categoryLabel: 'Press-on Nails',
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371',
        description: 'A beautiful new set of nails.',
      };
      await api.createProduct(newProduct, user.token);
      triggerToast('Product created!', 'success');
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
                            className="flex items-center text-xs font-bold text-emerald-600 hover:text-emerald-800"
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
                  onClick={handleCreateDummyProduct}
                  className="bg-zinc-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded hover:bg-amber-700 transition"
                >
                  + Quick Add Product
                </button>
              </div>
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
                          <img src={product.image || product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
                        </td>
                        <td className="px-6 py-4 font-medium text-zinc-900">{product.name}</td>
                        <td className="px-6 py-4">₹{product.price}</td>
                        <td className="px-6 py-4">{product.category}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-zinc-400 hover:text-amber-600 mr-3" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteProduct(product.id || (product as any)._id)} className="text-zinc-400 hover:text-red-600" title="Delete">
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
