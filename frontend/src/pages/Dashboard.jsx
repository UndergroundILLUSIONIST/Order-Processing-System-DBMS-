import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <h1>Dashboard</h1>
            <div className="card">
                <h2>Welcome, {user?.username}</h2>
                <p>Role: {user?.role}</p>
                <p>Use the navigation bar to access different modules of the Order Processing System.</p>
            </div>
        </div>
    );
};

export default Dashboard;
