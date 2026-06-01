import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/Common/ProtectedRoute';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { Layout } from './components/Layout';

// Pages & Components
import Home from './pages/Home';
import Login from './components/Auth/Login';
import StaffLogin from './components/Auth/StaffLogin';
import Register from './components/Auth/Register';
import Profile from './components/Auth/Profile';
import Destinations from './pages/Destinations';
import TripTypes from './pages/TripTypes';
import Blogs from './pages/Blogs';
import About from './pages/About';
import PackageList from './components/Packages/PackageList';
import PackageDetail from './components/Packages/PackageDetail';
import PackageForm from './components/Packages/PackageForm';
import BookingDetail from './components/Bookings/BookingDetail';
import Dashboard from './components/Dashboard/Dashboard';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

function App() {
    return (
        <ErrorBoundary>
            <Router>
                <AuthProvider>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Layout><Home /></Layout>} />
                        <Route path="/login" element={<Layout><Login /></Layout>} />
                        <Route path="/staff-login" element={<Layout><StaffLogin /></Layout>} />
                        <Route path="/register" element={<Layout><Register /></Layout>} />
                        <Route path="/destinations" element={<Layout><Destinations /></Layout>} />
                        <Route path="/trip-types" element={<Layout><TripTypes /></Layout>} />
                        <Route path="/blogs" element={<Layout><Blogs /></Layout>} />
                        <Route path="/about" element={<Layout><About /></Layout>} />
                        <Route path="/packages" element={<Layout><PackageList /></Layout>} />
                        <Route path="/packages/:id" element={<Layout><PackageDetail /></Layout>} />

                        {/* Protected Package Management */}
                        <Route
                            path="/packages/new"
                            element={
                                <ProtectedRoute requiredRoles={['Manager', 'Super Admin']}>
                                    <Layout><PackageForm /></Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/packages/:id/edit"
                            element={
                                <ProtectedRoute requiredRoles={['Manager', 'Super Admin']}>
                                    <Layout><PackageForm /></Layout>
                                </ProtectedRoute>
                            }
                        />

                        {/* Protected User Routes */}
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute requiredRoles={['Customer', 'Consultant', 'Manager', 'Super Admin']}>
                                    <Layout><Profile /></Layout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/bookings/:id"
                            element={
                                <ProtectedRoute requiredRoles={['Customer', 'Consultant', 'Manager', 'Super Admin']}>
                                    <Layout><BookingDetail /></Layout>
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute requiredRoles={['Customer', 'Consultant', 'Manager', 'Super Admin']}>
                                    <Layout><Dashboard /></Layout>
                                </ProtectedRoute>
                            }
                        />

                        {/* Error Handling Routes */}
                        <Route path="/unauthorized" element={<Layout><Unauthorized /></Layout>} />
                        <Route path="*" element={<Layout><NotFound /></Layout>} />
                    </Routes>
                </AuthProvider>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
