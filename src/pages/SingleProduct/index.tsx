import { useNavigate, useParams } from 'react-router-dom';
import './styles.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useApi } from '../../hooks/useApi';
import { UUID } from 'crypto';

type Props = {}

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

const SingleProduct = (props: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const api = useApi();

  const [productName, setProductName] = useState<string>("");
  const [productCategory, setProductCategory] = useState<string>("");
  const [productStock, setProductStock] = useState<number>(0);
  const [productId, setProductId] = useState<string>("");
  const [customerToken, setCustomerToken] = useState<string>("");
  const [productCost, setProductCost] = useState<number>(0);
  const [productPrice, setProductPrice] = useState<number>(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    const getProduct = async (id: string | undefined, token: string | undefined) => {
      try { 
        if (token !== null && id !== undefined) {
          const product = await api.getProductById(id, token!);
          setProductName(product.name);
          setProductCategory(product.categoryName);
          setProductStock(product.stock); 
          setProductCost(product.cost);  
          setProductPrice(product.price);  
          setProductId(product.product_id);
          setCustomerToken(token || "");
        } 
      } catch (err) {
        console.log(err); 
      }     
    } 

    getProduct(id, token!);
  }, []); 
  const compareDates = (a: Order, b: Order) => {
    const dateA = new Date(a.createdAt) as any;
    const dateB = new Date(b.createdAt) as any;

    return dateB - dateA;
  };
   
  useEffect(() => {
    const getOrdersByProduct = async (token: string | null) => {
      try {
        if (token?.includes) {
          const orders = await api.getOrdersByProduct(id, token);
          const reverseOrders = orders.reverse(compareDates);
          setOrders(reverseOrders);
          setFilteredOrders(reverseOrders); 
        }
      } catch (err) {
        console.log(err);
      }
    };

    getOrdersByProduct(token);
  }, [id, token]);


  useEffect(() => {
    const getAllOrders = async (token: string | null) => {
      try {
        if (token?.includes) {
          const allOrdersList = await api.getAllOrders(token);
          setAllOrders(allOrdersList)
        }
      } catch (err) {
        console.log(err);
      }
    };

    getAllOrders(token);
  }, [id, token]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString); 
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  const handleSingleOrder = (id: string) => {
    navigate(`/singleorder/${id}`);
  };

  const handleAddStock = (id: string) => {
    navigate(`/addstock/${id}`);
  };

  const handleRemoveStock = (id: string) => {
    navigate(`/removestock/${id}`);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteProduct = async (id: string | undefined, token: string) => {
    if (id && token) {
      await api.deleteProductById(id, token);
      navigate(`/products`);
    }
  };

  return (
    <div>
      <div className="table-container">
        <table className="product-table">
          <tbody>
            <tr>
              <td className="label">Nome:</td>
              <td className="value">{productName}</td>
            </tr> 
            <tr>
              <td className="label">Categoria:</td>
              <td className="value">{productCategory}</td>
            </tr>
            <tr>
              <td className="label">Estoque:</td>
              <td className="value">{productStock}</td>
            </tr>
            <tr>
              <td className="label">Valor custo:</td>
              <td className="value">R$ {productCost.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="label">Valor comercializado:</td>
              <td className="value">R$ {productPrice.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="label">Taxa de conversão:</td>
              <td className="value">
                {orders.length === 0 ? 'Não houve pedidos ainda' : `${orders.length / allOrders.length * 100 }%`}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="removeEditContainer">
          <button id="edit" onClick={() => handleAddStock(productId)}>Adicionar estoque</button>
          <button id="edit" onClick={() => handleRemoveStock(productId)}>Remover estoque</button>
          {orders.length === 0 && (
            <button id="delete" onClick={() => handleDeleteProduct(productId, customerToken)}>Deletar</button>
          )}
        </div>
        <div className="recentOrders">
          <h3>Pedidos Recentes com {productName}</h3>
        </div>
        <div className="tableProducts">
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
      </div>
    </div>
  )
}

export default SingleProduct;