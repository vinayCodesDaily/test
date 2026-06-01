import Navbar from './Common/Navbar';
import Footer from './Common/Footer';

export const Layout = ({ children }) => {
    return (
        <div className="app-container">
            <Navbar />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
