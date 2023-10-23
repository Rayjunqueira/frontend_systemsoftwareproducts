import './styles.css';

import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AddCommentIcon from '@mui/icons-material/AddComment';
import Button from '@mui/material/Button';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useApi } from '../../hooks/useApi';
import { UUID } from 'crypto';

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

type Props = {};

const IconWrapper = styled('span')({
  display: 'flex',
  alignItems: 'center',
  marginRight: '8px',
});

const Orders = (props: Props) => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const api = useApi();

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const compareDates = (a: Order, b: Order) => {
    const dateA = new Date(a.createdAt) as any;
    const dateB = new Date(b.createdAt) as any;
  
    return dateB - dateA;
  };
 
  useEffect(() => {
    const getOrders = async (token: string | null) => {
      try {
        if (token?.includes) {
          const orders = await api.getAllOrders(token);
          const reversedOrders = orders.reverse(compareDates);
          setOrders(reversedOrders);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getOrders(token);
  }, []);

  const handleAddOrder = () => {
    navigate('/addorder');
  };

  const handleSingleOrder = (id: string) => {
    navigate(`/singleorder/${id}`);
  };

  useEffect(() => {
    const searchTextLower = searchText.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchTextLower) ||
        order.customerName.toLowerCase().includes(searchTextLower) ||
        order.createdAt.toLowerCase().includes(searchTextLower)
    );
    setFilteredOrders(filtered);
  }, [searchText, orders]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString); 
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  return (
    <div>
      <div className="inputContainer">
        <input
          type="text"
          placeholder="Buscar pedido por número, cliente ou data."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleAddOrder}
          disableElevation
          style={{ backgroundColor: '#FFAA2B' }}
        >
          <IconWrapper>
            <AddCommentIcon />
          </IconWrapper>
          Registrar Pedido
        </Button>
      </div>
      <div className="tableOrders">
        <table>
          <thead>
            <tr>
              <th scope="col">N de pedido</th>
              <th scope="col">Cliente</th>
              <th scope="col">Data</th>
              <th scope="col">Valor total</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr
                key={order.order_id}
                onClick={() => handleSingleOrder(order.order_id)}
              >
                <td data-label="N DE PEDIDO">{order.orderNumber}</td>
                <td data-label="CLIENTE">{order.customerName}</td>
                <td data-label="DATA">{formatDate(order.createdAt)}</td>
                <td data-label="VALOR TOTAL">
                  R${order.totalAmount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={pageNumber === currentPage ? 'active' : ''}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Orders;
