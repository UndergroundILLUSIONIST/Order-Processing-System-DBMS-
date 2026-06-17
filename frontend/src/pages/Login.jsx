import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { Hexagon } from 'lucide-react';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            await login(data.username, data.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="login-wrapper">
            <div className="glass-panel login-card">
                <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                    <Hexagon size={48} color="#6366f1" strokeWidth={2} style={{marginBottom: '1rem'}} />
                    <h2 style={{margin: 0}}>Welcome Back</h2>
                    <p style={{color: 'var(--text-muted)', margin: '0.5rem 0 0 0'}}>Sign in to your account</p>
                </div>

                {error && <div className="error-text" style={{marginBottom: '1rem', textAlign: 'center'}}>{error}</div>}
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                            className="form-control"
                            {...register('username', { required: 'Username is required' })} 
                            type="text" 
                            placeholder="Enter your username"
                        />
                        {errors.username && <span className="error-text">{errors.username.message}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            className="form-control"
                            {...register('password', { required: 'Password is required' })} 
                            type="password" 
                            placeholder="Enter your password"
                        />
                        {errors.password && <span className="error-text">{errors.password.message}</span>}
                    </div>
                    
                    <button type="submit" className="btn" style={{width: '100%', marginTop: '1rem'}}>
                        Sign In
                    </button>
                </form>
                
                <div style={{marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)'}}>
                    <strong style={{color: '#fff'}}>Demo Credentials:</strong><br/>
                    Admin: <code style={{color: 'var(--primary-accent)'}}>admin</code> / <code style={{color: 'var(--primary-accent)'}}>password123</code><br/>
                    User: <code style={{color: 'var(--primary-accent)'}}>johndoe</code> / <code style={{color: 'var(--primary-accent)'}}>customer123</code>
                </div>
            </div>
        </div>
    );
};

export default Login;
