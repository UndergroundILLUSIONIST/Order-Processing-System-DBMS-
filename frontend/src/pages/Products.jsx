import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Plus, ShoppingCart, Search } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async () => {
        try {
            await api.post('/products', {
                name: 'New Custom Product',
                description: 'Generated test product',
                price: 199.99,
                stock_quantity: 10,
                supplier_id: 1
            });
            fetchProducts();
        } catch (err) {
            alert('Admin permissions required to add products');
        }
    };

    const filteredProducts = products.filter(p => 
        (p.NAME || p.name).toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex-between">
                <div>
                    <h1>Product Inventory</h1>
                    <p style={{color: 'var(--text-muted)', margin: 0}}>Manage your catalog and stock levels.</p>
                </div>
                {user?.role === 'ADMIN' && (
                    <button className="btn" onClick={handleAddProduct}><Plus size={18} /> Add Product</button>
                )}
            </div>
            
            <div style={{marginBottom: '1.5rem', position: 'relative'}}>
                <Search size={20} style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)'}} />
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search products by name..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{paddingLeft: '3rem', maxWidth: '400px'}}
                />
            </div>

            <div className="glass-panel table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(p => {
                            const stock = p.STOCK_QUANTITY || p.stock_quantity;
                            const isLowStock = stock < 100;
                            return (
                                <tr key={p.PRODUCT_ID || p.product_id}>
                                    <td style={{fontWeight: 500}}>{p.NAME || p.name}</td>
                                    <td style={{color: 'var(--text-muted)'}}>{p.DESCRIPTION || p.description}</td>
                                    <td style={{fontWeight: 600}}>${p.PRICE || p.price}</td>
                                    <td>
                                        <span className={`badge ${isLowStock ? 'badge-warning' : 'badge-success'}`}>
                                            {stock} left
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn" style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem'}} onClick={() => addToCart(p)}>
                                            <ShoppingCart size={14} /> Add to Cart
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No products found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;
