import logo from './logo.svg';
import './App.css';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import PrivateRoute from './Components/PrivateRoute';
import BookingList from './Components/BookingList';
import { AuthProvider } from "./Components/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './utils/Header';
import Footer from './utils/Footer';
import BookingHistory from './Components/bookingHistory';
import BusRouteSearch from './Components/findBus';
import AdminControl from './Components/AdminList';
import AdminDashboard from './Components/AdminDashboard';
import Payment from './Components/Paymentcrud';

function App() {
  return (
    <Router>
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          {/* <Route path="/bookingList" element={<BookingList />} /> */}
          <Route path="/bookingHistory" element={<BookingHistory />} />
          <Route path="/findBus" element={<BusRouteSearch />} />
          <Route path="/admins" element={<AdminDashboard />} />
          <Route path="/payments" element={<Payment/>} />

        </Route>
      </Routes>
      <Footer />
      <ToastContainer />
    </AuthProvider>
  </Router>
  );
}

export default App;