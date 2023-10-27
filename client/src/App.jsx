import Home from "./pages/Home";
import {Routes,Route,useLocation} from 'react-router-dom'
import Layout from './Layout'
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Contact from "./pages/Contact";
import {Toaster} from 'react-hot-toast'


import Profile from './pages/Dashboard/Profile'
import Playareas from "./pages/Dashboard/Playareas";
import SinglePlayArea from "./pages/Dashboard/SinglePlayArea";
import Users from "./pages/Dashboard/Users";
import Bookings from './pages/Dashboard/Bookings'


const App = () => {

  

  return (
    <Layout>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />



        <Route path="/profile" element={<Profile />} />
        <Route path="/playareas" element={<Playareas />} />
        <Route path="/users" element={<Users />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/playareas/:id" element={<SinglePlayArea />} />


        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Layout>
  );
};

export default App;
