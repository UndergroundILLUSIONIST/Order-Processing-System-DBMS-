import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useForm } from 'react-hook-form';

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
        <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <div className="card">
                <h2 style={{marginTop: 0}}>Login to Order System</h2>
                {error && <div className="error-text" style={{marginBottom: '1rem'}}>{error}</div>}
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                            {...register('username', { required: 'Username is required' })} 
                            type="text" 
                        />
                        {errors.username && <span className="error-text">{errors.username.message}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            {...register('password', { required: 'Password is required' })} 
                            type="password" 
                        />
                        {errors.password && <span className="error-text">{errors.password.message}</span>}
                    </div>
                    
                    <button type="submit" className="btn" style={{width: '100%'}}>Login</button>
                </form>
                
                <p style={{fontSize: '0.875rem', marginTop: '1rem', color: '#aaa'}}>
                    Demo Admin: admin / password123<br/>
                    Demo User: johndoe / customer123
                </p>
            </div>
        </div>
    );
};

export default Login;
