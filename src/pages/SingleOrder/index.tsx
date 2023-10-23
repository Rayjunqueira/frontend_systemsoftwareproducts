import { useNavigate, useParams } from 'react-router-dom';
import './styles.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useApi } from '../../hooks/useApi';
import { UUID } from 'crypto';

type OrderItem = {
  sale_id: string;
  stock: number;
  product: {
    name: string;
    price: number;
  };
}

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


const SingleOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const api = useApi();

  const [customerName, setCustomerName] = useState<string>("");
  const [customerCategory, setCustomerCategory] = useState<string>("");
  const [customerCellphone, setCustomerCellphone] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [orderDate, setOrderDate] = useState<string>("");
  const [orderHour, setOrderHour] = useState<string>("");
  const [salesOrder, setSalesOrder] = useState<OrderItem[]>([]);
  const [customerToken, setCustomerToken] = useState<string>("");

  useEffect(() => {
    const getOrder = async (id: string | undefined, token: string | undefined) => {
      try { 
        if (token !== null && id !== undefined) {
          const singleOrderInfo = await api.getOrderById(id, token!);
          setCustomerName(singleOrderInfo.customerName); 
          setCustomerCategory(singleOrderInfo.categoryName);
          setCustomerCellphone(singleOrderInfo.customerPhone);
          setOrderDate(singleOrderInfo.createdAt);
          setOrderHour(singleOrderInfo.createdHour);
          setCustomerToken(token || "");
          if (singleOrderInfo.discount != null) {
            setDiscount(singleOrderInfo.discount);
          } else {
            setDiscount(0.0);
          }
          setTotalAmount(singleOrderInfo.totalAmount);
          setSalesOrder(singleOrderInfo.sales);
        }
      } catch (err) {
        console.log(err); 
      }     
    } 

    getOrder(id, token!);
  }, []); 

  const formatDate = (dateString: string) => {
    const date = new Date(dateString); 
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
  
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
  
    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  const handleRemoveOrder = async () => {
    try {
      const salesForDelete = await api.getSalesByOrder(id, customerToken);
  
      if (salesForDelete.length === 0) {
        console.log("Sale not found!");
      } else {
        const lastSaleId = salesForDelete[salesForDelete.length - 1].sale_id;
        const deleteSale = await api.deleteSaleById(lastSaleId, customerToken);
  
        if (deleteSale) {
          const deleteOrder = await api.deleteOrderById(id, customerToken);
  
          if (deleteOrder) {
            navigate("/orders");
          } else {
            console.log("Error.");
          }
        } else {
          console.log("Error delete sale.");
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div>
      <div className="invoice">
          <header>
              <h1>Nota Fiscal</h1>
              <p>Data: {formatDate(orderDate)}</p>
              <p>ás {orderHour}</p>
          </header>
          <main>
              <section className="customer">
                  <h2>Informações do Cliente</h2>
                  <p><strong>Nome:</strong> {customerName}</p>
                  <p><strong>Telefone:</strong> {customerCellphone}</p>
                  <p><strong>Categoria:</strong> {customerCategory}</p>
              </section>
              <section className="items">
                  <h2>Itens do Pedido</h2>
                  <table>
                      <thead>
                          <tr>
                              <th>Produto</th>
                              <th>Quantidade</th>
                              <th>Preço Unitário</th>
                              <th>Total</th>
                          </tr>
                      </thead>
                      <tbody>
                        {salesOrder.map((sale) => (
                          <tr key={sale.sale_id}>
                            <td>{sale.product.name}</td>
                            <td>{sale.stock}</td>
                            <td>R$ {sale.product.price.toFixed(2)}</td>
                            <td>R$ {(sale.stock * sale.product.price).toFixed(2)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
              </section>
          </main>
          <footer>
              <p>Desconto: <strong>R$ {discount.toFixed(2)}</strong></p>
              <p><strong>Total: R$ {totalAmount.toFixed(2)}</strong></p>
          </footer>
      </div>
      <div className="removeOrder">
        <button onClick={handleRemoveOrder}>Desfazer pedido</button>
      </div>
    </div>
  )
}

export default SingleOrder;