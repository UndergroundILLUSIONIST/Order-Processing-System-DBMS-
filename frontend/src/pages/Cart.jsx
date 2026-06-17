import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Trash2, ShoppingBag } from 'lucide-react';

const Cart = () => {
    const { cart, removeFromCart, clearCart, cartTotal, cartCount } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [checkingOut, setCheckingOut] = useState(false);

    const handleCheckout = async () => {
        if (cartCount === 0) return;
        setCheckingOut(true);
        try {
            await api.post('/orders', {
                customer_id: user.id,
                items: cart.map(i => ({ product_id: i.PRODUCT_ID || i.product_id, quantity: i.quantity, unit_price: i.PRICE || i.price }))
            });
            clearCart();
            alert('Order placed successfully!');
            navigate('/orders');
        } catch (err) {
            alert('Failed to checkout');
        } finally {
            setCheckingOut(false);
        }
    };

    return (
        <div>
            <div className="flex-between">
                <div>
                    <h1>Shopping Cart</h1>
                    <p style={{color: 'var(--text-muted)', margin: 0}}>Review your items before checkout.</p>
                </div>
            </div>

            {cart.length === 0 ? (
                <div className="glass-panel card" style={{textAlign: 'center', padding: '3rem'}}>
                    <ShoppingBag size={48} color="var(--text-muted)" style={{marginBottom: '1rem'}} />
                    <h2>Your cart is empty</h2>
                    <p style={{color: 'var(--text-muted)'}}>Looks like you haven't added any products yet.</p>
                    <button className="btn" onClick={() => navigate('/products')} style={{marginTop: '1rem'}}>Browse Products</button>
                </div>
            ) : (
                <div style={{display: 'flex', gap: '2rem'}}>
                    <div className="glass-panel table-container" style={{flex: 2}}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, idx) => (
                                    <tr key={idx}>
                                        <td style={{fontWeight: 500}}>{item.NAME || item.name}</td>
                                        <td>${item.PRICE || item.price}</td>
                                        <td>{item.quantity}</td>
                                        <td style={{fontWeight: 600}}>${((item.PRICE || item.price) * item.quantity).toFixed(2)}</td>
                                        <td>
                                            <button className="btn btn-secondary" style={{padding: '0.4rem', color: 'var(--status-danger-text)'}} onClick={() => removeFromCart(item.PRODUCT_ID || item.product_id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="glass-panel card" style={{flex: 1, height: 'fit-content'}}>
                        <h2>Order Summary</h2>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)'}}>
                            <span>Items ({cartCount}):</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-muted)'}}>
                            <span>Tax (0%):</span>
                            <span>$0.00</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem'}}>
                            <strong style={{fontSize: '1.2rem'}}>Total:</strong>
                            <strong style={{fontSize: '1.2rem'}}>${cartTotal.toFixed(2)}</strong>
                        </div>
                        <button className="btn" style={{width: '100%'}} onClick={handleCheckout} disabled={checkingOut}>
                            {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
