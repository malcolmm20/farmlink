import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import FarmerDashboard from './pages/FarmerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ProductDetail from './pages/ProductDetail';
import { FarmProfilePage } from './pages/FarmProfilePage';
import ProductDetails from './pages/ProductDetails';
import Farms from './pages/Farms';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes outside of Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Main app routes inside Layout */}
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/products" element={
          <Layout>
            <Products />
          </Layout>
        } />
        <Route path="/farms" element={
          <Layout>
            <Farms />
          </Layout>
        } />
        <Route path="/product/:id" element={
          <Layout>
            <ProductDetail />
          </Layout>
        } />
        <Route path="/cart" element={
          <Layout>
            <Cart />
          </Layout>
        } />
        <Route path="/farmer/dashboard" element={
          <Layout>
            <FarmerDashboard />
          </Layout>
        } />
        <Route path="/admin/dashboard" element={
          <Layout>
            <AdminDashboard />
          </Layout>
        } />
        <Route path="/farm/:farmId" element={
          <Layout>
            <FarmProfilePage />
          </Layout>
        } />
        <Route path="/products/:id" element={
          <Layout>
            <ProductDetails />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App; 