import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/tempInstance';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading]= useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');

 // Fetch Products from MongoDB
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false); // <--- Crucial: Stop loading state
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!title || !price || !stock) return;

    try {
      await API.post('/products', {
        title,
        price: parseFloat(price),
        category,
        stock: parseInt(stock, 10),
        // Checks if image is empty or whitespace
        image: image.trim() !== '' ? image : "https://via.placeholder.com/300x300?text=No+Product+Image"
      });
      setTitle(''); setPrice(''); setStock(''); setImage('');
      fetchProducts();
    } catch (err) {
      alert("Failed to add product");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  // Live Filter Logic
  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalValue = filteredProducts.reduce((acc, curr) => acc + curr.price * curr.stock, 0);

  return (
    <div className="min-h-screen bg-[#EAEDED] text-gray-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-6 rounded shadow-sm border border-gray-200 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900"> MarketHub Catalog Manager</h1>
            <p className="text-xs text-gray-500 mt-1">Live MongoDB storage and product management</p>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Total Items</span>
              <span className="text-xl font-extrabold text-amber-600">{filteredProducts.length}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Total Inventory Value</span>
              <span className="text-xl font-extrabold text-emerald-600">${totalValue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mb-6 bg-white p-4 rounded shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search products by title..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Computers">Computers</option>
            <option value="Furniture">Furniture</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Apparel">Apparel</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* List Product Form */}
          <div className="bg-white p-6 rounded shadow-sm border border-gray-200 h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              List New Product
            </h2>
            
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Mouse"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="29.99"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Quantity Stock</label>
                  <input
                    type="number"
                    required
                    placeholder="100"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                <select
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Electronics</option>
                  <option>Computers</option>
                  <option>Furniture</option>
                  <option>Home & Kitchen</option>
                  <option>Apparel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-2 rounded border border-amber-600 shadow-sm transition-all text-sm mt-2"
              >
                Save to Database
              </button>
            </form>
          </div>

          {/* Product Cards */}
          <div className="lg:col-span-2 space-y-4">
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-8 rounded text-center text-gray-500 border border-gray-200">
                No products found matching your search.
              </div>
            ) : (
              filteredProducts.map((item) => (
                <div key={item._id} className="bg-white p-4 rounded shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded border border-gray-200 bg-gray-50 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                        {item.category}
                      </span>
                      <h3 className="font-semibold text-gray-900 text-sm mt-1">{item.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">In Stock: <span className="font-medium text-gray-800">{item.stock} units</span></p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                    <span className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</span>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-xs text-red-600 hover:text-red-800 border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </main>
    </div>
  );
}