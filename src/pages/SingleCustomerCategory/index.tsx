import { useNavigate, useParams } from 'react-router-dom';
import './styles.css';
import { useApi } from '../../hooks/useApi';
import { useContext, useEffect, useState } from 'react';
import { UUID } from 'crypto';
import { AuthContext } from '../../contexts/AuthContext';

type Customer = {
  customer_id: UUID;
  name: string;
  createdAt: string;
  category: string;
  cellphone1: string;
  cellphone2: string;
  email: string;
};

type Props = {}

const SingleCustomerCategory = (props: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const api = useApi();

  const [customerCategoryName, setCustomerCategoryName] = useState<string>("");
  const [customerCategoryId, setCustomerCategoryId] = useState<string>("");
  const [customerCategoryNumber, setCustomerCategoryNumber] = useState<number>(0);
  const [customerToken, setCustomerToken] = useState<string>("");
  const [customerCategoryDate, setCustomerCategoryDate] = useState<string>("");
  const [customerCategoryDescription, setCustomerCategoryDescription] = useState<string>("");
  const [customerCategoryHour, setCustomerCategoryHour] = useState<string>("");
  const [customersInCategory, setCustomersInCategory] = useState<Customer[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const getCustomerCategory = async (id: string | undefined, token: string | undefined) => {
      try { 
        if (token !== null && id !== undefined) {
          const customerCategoryInfo = await api.getCustomerCategoryById(id, token!);
          setCustomerCategoryName(customerCategoryInfo.name);
          setCustomerCategoryId(customerCategoryInfo.customer_category_id);
          setCustomerToken(token || "");
          setCustomerCategoryNumber(customerCategoryInfo.customers.length);
          setCustomerCategoryDescription(customerCategoryInfo.description); 
          setCustomerCategoryDate(customerCategoryInfo.createdAt);
          setCustomerCategoryHour(customerCategoryInfo.createdHour);
          setCustomersInCategory(customerCategoryInfo.customers)
        }
      } catch (err) {
        console.log(err); 
      }     
    } 

    getCustomerCategory(id, token!);
  }, []); 

  const compareDates = (a: Customer, b: Customer) => {
    const dateA = new Date(a.createdAt) as any;
    const dateB = new Date(b.createdAt) as any;

    return dateB - dateA;
  };
  
  useEffect(() => {
    const getCustomersByCategory = async (token: string | null) => {
      try {
        if (token?.includes) {
          const customers = await api.getCustomersByCategory(id, token);
          const sortedCustomers = customers.sort(compareDates);
          setCustomers(sortedCustomers);
          setFilteredCustomers(sortedCustomers); 
        }
      } catch (err) {
        console.log(err);
      }
    };

    getCustomersByCategory(token);
  }, [id, token]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
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

  const handleSingleCustomer = (id: string) => {
    navigate(`/singlecustomer/${id}`);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteCustomerCategory = async (id: string | undefined, token: string) => {
    if (id && token) {
      await api.deleteCustomerCategoryById(id, token);
      navigate(`/customercategories`);
    }
  };

  return (
    <div>
      <div className="table-customerCategory">
        <table className="customerCategory-table">
          <tbody>
            <tr> 
              <td className="label">Nome</td>
              <td className="value">{customerCategoryName}</td>
            </tr>
            <tr>
              <td className="label">Quantidade de clientes:</td>
              <td className="value">{customerCategoryNumber}</td>
            </tr>
            <tr>
              <td className="label">Data de criação:</td>
              <td className="value">{formatDate(customerCategoryDate)}</td>
            </tr>            
            <tr>
              <td className="label">Horário de criação:</td>
              <td className="value">{customerCategoryHour}</td>
            </tr>
          </tbody>
        </table>
        <div className="removeEditContainer">
        {customers.length === 0 && (
          <div>
            <button id="edit">Editar</button>
            <button id="delete" onClick={() => handleDeleteCustomerCategory(customerCategoryId, customerToken)}>Deletar</button>
          </div>
        )}
        </div>
        <div className="customersListInCustomerCategory">
          <hr />
          <h3>Lista de clientes dessa categoria</h3>
          <hr />
        </div>
          <div className="tableCustomersByCategory">
            <table>
              <thead>
                <tr>
                  <th scope="col">Cliente</th>
                  <th scope="col">Categoria</th>
                  <th scope="col">Telefone</th>
                  <th scope="col">ID</th>
                </tr>
              </thead>
              <tbody>
              {currentCustomers.map((customer) => (
              <tr key={customer.customer_id} onClick={() => handleSingleCustomer(customer.customer_id)}>
                <td data-label="Cliente">{customer.name}</td>
                <td data-label="Categoria">{customer.category}</td>
                <td data-label="Telefone">{customer.cellphone1}</td>
                <td data-label="ID">{customer.customer_id}</td>
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

export default SingleCustomerCategory; 