import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Products from './pages/Products';
import AddCustomer from './pages/AddCustomer';
import AddProduct from './pages/AddProduct';
import AddOrder from './pages/AddOrder';
import Categories from './pages/Categories';
import AddCategory from './pages/AddCategory';
import SingleCategory from './pages/SingleCategory';
import AddTransaction from './pages/AddTransaction';
import Stats from './pages/Stats';
import CustomerCategories from './pages/CustomerCategories';
import SingleReport from './pages/SingleReport';
import SingleTransaction from './pages/SingleTransaction';
import SingleProduct from './pages/SingleProduct';
import SingleCustomer from './pages/SingleCustomer';
import SingleOrder from './pages/SingleOrder';
import SingleCustomerCategory from './pages/SingleCustomerCategory';
import AddCustomerCategory from './pages/AddCustomerCategory';
import Reports from './pages/Reports';
import SingleMonthReport from './pages/SingleMonthReport';
import Tasks from './pages/Tasks';
import Transactions from './pages/Transactions';
import Authpage from './pages/Authpage';

import Navegation from './components/Navegation';
import { RequireAuth } from './contexts/RequireAuth';
import { RequireNotAuth } from './contexts/RequireNotAuth';
import AddStock from './pages/AddStock';
import DeleteStock from './pages/DeleteStock';

export function InvalidRoute() {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate('/');
  }, [navigate]);

  return null;
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const showNavigation = location.pathname !== '/auth';

  return (
    <div>
      {showNavigation && <Navegation />}
        <Routes>
          <Route path='/' element={<RequireAuth><Homepage /></RequireAuth>} />
          <Route path='/customers' element={<RequireAuth><Customers /></RequireAuth>} />
          <Route path='/orders' element={<RequireAuth><Orders /></RequireAuth>} />
          <Route path='/reports' element={<RequireAuth><Reports /></RequireAuth>} />
          <Route path='/products' element={<RequireAuth><Products /></RequireAuth>} />
          <Route path='/addproduct' element={<RequireAuth><AddProduct /></RequireAuth>} />
          <Route path='/addorder' element={<RequireAuth><AddOrder /></RequireAuth>} />
          <Route path='/addcustomer' element={<RequireAuth><AddCustomer /></RequireAuth>} />
          <Route path='/addtransaction' element={<RequireAuth><AddTransaction /></RequireAuth>} />
          <Route path='/singlemonthreport' element={<RequireAuth><SingleMonthReport /></RequireAuth>} />
          <Route path='/categories' element={<RequireAuth><Categories /></RequireAuth>} />
          <Route path='/addcategory' element={<RequireAuth><AddCategory /></RequireAuth>} />
          <Route path='/addstock/:id' element={<RequireAuth><AddStock /></RequireAuth>} />
          <Route path='/removestock/:id' element={<RequireAuth><DeleteStock /></RequireAuth>} />
          <Route path='/singlecategory/:id' element={<RequireAuth><SingleCategory /></RequireAuth>} />
          <Route path='/singlecustomer/:id' element={<RequireAuth><SingleCustomer /></RequireAuth>} />
          <Route path='/addtransaction' element={<RequireAuth><AddTransaction /></RequireAuth>} />
          <Route path='/addcustomercategory' element={<RequireAuth><AddCustomerCategory /></RequireAuth>} />
          <Route path='/stats' element={<RequireAuth><Stats /></RequireAuth>} />
          <Route path='/transactions' element={<RequireAuth><Transactions /></RequireAuth>} />
          <Route path='/customercategories' element={<RequireAuth><CustomerCategories /></RequireAuth>} />
          <Route path='/singlereport' element={<RequireAuth><SingleReport /></RequireAuth>} />
          <Route path='/singlecustomercategory/:id' element={<RequireAuth><SingleCustomerCategory /></RequireAuth>} />
          <Route path='/singleproduct/:id' element={<RequireAuth><SingleProduct /></RequireAuth>} />
          <Route path='/singleorder/:id' element={<RequireAuth><SingleOrder /></RequireAuth>} />
          <Route path='/tasks' element={<RequireAuth><Tasks /></RequireAuth>} />
          <Route path='/singletransaction/:id' element={<RequireAuth><SingleTransaction /></RequireAuth>} />
          <Route path='/auth' element={<RequireNotAuth><Authpage /></RequireNotAuth>} />
          <Route path='/*' element={<RequireAuth><InvalidRoute /></RequireAuth>} />
        </Routes>
    </div>
  );
}

export default App;
