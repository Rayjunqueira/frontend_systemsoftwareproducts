import React, { useContext, useEffect, useState } from 'react';
import './styles.css';

import PersonIcon from '@mui/icons-material/Person';
import WidgetsIcon from '@mui/icons-material/Widgets';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useApi } from '../../hooks/useApi';
import { AuthContext } from '../../contexts/AuthContext';
import { UUID } from 'crypto';
import { useNavigate } from 'react-router-dom';

type Props = {};

type Order = {
  order_id: UUID;
  customer_id: UUID;
  customerName: string;
  orderNumber: string;
  sales: [];
  totalAmount: number;
  profit: number;
  totalcost: string;
  createdAt: string;
};

const Homepage = (props: Props) => {
  const { token } = useContext(AuthContext);
  const api = useApi();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLast30Days, setOrdersLast30Days] = useState<Order[]>([]);
  const [totalAmountLast30Days, setTotalAmountLast30Days] = useState(0);
  
  const handleCustomers = () => {
    navigate("/customers")
  }

  const handleProducts = () => {
    navigate("/products")
  }

  const handleOrders = () => {
    navigate("/orders")
  }

  const handleAddOrder = () => {
    navigate("/addorder")
  }

  useEffect(() => {
    const getOrders = async (token: string | null) => {
      try {
        if (token?.includes) {
          const allOrders = await api.getAllOrders(token);
          console.log(allOrders);
          setOrders(allOrders);

          const currentDate = new Date();
          currentDate.setDate(currentDate.getDate() - 30); 
          const filteredOrders = allOrders.filter((order: Order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= currentDate;
          });

          setOrdersLast30Days(filteredOrders);

          const sumTotalAmount = filteredOrders.reduce(
            (total: number, order: Order) => total + order.totalAmount,
            0
          );

          setTotalAmountLast30Days(sumTotalAmount);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getOrders(token);
  }, [token]);

  return (
    <div>
      <div className="welcomeContainer">
        <h3>Bem-vindo, user!</h3>
        <h4>Sua receita nos últimos 30 dias</h4>
        <h4 id='receive'>R$ {totalAmountLast30Days.toFixed(2)}</h4>
      </div>
      <div className="squareContainer">
        <div className="square" onClick={handleCustomers}>
          <i><PersonIcon id='icon'/></i>
          <h4>Verificar lista de clientes</h4>
        </div>
        <div className="square" onClick={handleProducts}>
        <i><WidgetsIcon id='icon'/></i>
          <h4>Verificar lista de produtos</h4>
        </div>
        <div className="square" onClick={handleOrders}>
          <i><ShoppingCartIcon id='icon'/></i>
          <h4>Verificar lista de pedidos</h4>
        </div>        
      </div>        
      <div className="otherContainers" id='ordernow' onClick={handleAddOrder}>
        <h3>Registrar um novo pedido</h3>
      </div>  
      <div className="otherContainers">
        <h3>Verificar minhas transações</h3>
      </div>      
    </div>
  );
};

export default Homepage;
