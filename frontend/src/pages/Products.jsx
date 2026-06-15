import { useState, useEffect } from 'react';
import api from '../services/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1>Products Inventory</h1>
                <button className="btn">Add Product (Admin Only)</button>
            </div>
            
            <div className="card">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price ($)</th>
                            <th>Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.PRODUCT_ID || p.product_id}>
                                <td>{p.PRODUCT_ID || p.product_id}</td>
                                <td>{p.NAME || p.name}</td>
                                <td>{p.DESCRIPTION || p.description}</td>
                                <td>{p.PRICE || p.price}</td>
                                <td>{p.STOCK_QUANTITY || p.stock_quantity}</td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{textAlign: 'center'}}>No products found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;
