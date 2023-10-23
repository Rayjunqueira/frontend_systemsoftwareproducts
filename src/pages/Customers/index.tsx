import './styles.css';

import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AddCommentIcon from '@mui/icons-material/AddComment';
import Button from '@mui/material/Button';
import { useApi } from '../../hooks/useApi';
import { useContext, useEffect, useState } from 'react';
import { UUID } from 'crypto';
import { AuthContext } from '../../contexts/AuthContext';


type Customer = {
  customer_id: UUID;
  name: string;
  category: string;
  cellphone1: string;
  cellphone2: string;
  email: string;
};


type Props = {}

const IconWrapper = styled('span')({
  display: 'flex',
  alignItems: 'center',
  marginRight: '8px',
});


const Customers = (props: Props) => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext); 
  const api = useApi();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 15; 
 
  useEffect(() => {
    const getCustomers = async(token: string | null) => {
      try { 
        if(token?.includes) {
          const customers = await api.getAllCustomers(token);
          const reverseCustomers = customers.reverse();
          setCustomers(reverseCustomers);
        }
      } catch (err) {
        console.log(err);   
      }     
    } 
 
    getCustomers(token);
  }, []) 
 
  const handleAddCustomer = () => {
    navigate('/addcustomer'); 
  }

  const handleSingleCustomer = (id: string) => {
    navigate(`/singlecustomer/${id}`)
  }

  useEffect(() => {
    const searchTextLower = searchText.toLowerCase();
    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchTextLower) ||
      customer.category.toLowerCase().includes(searchTextLower) ||
      customer.customer_id.toLowerCase().includes(searchTextLower)
    );
    setFilteredCustomers(filtered);
  }, [searchText, customers]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);


  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <div className="inputContainer">
        <input 
          type="text" 
          placeholder='Buscar cliente por nome, id ou telefone.'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddCustomer} disableElevation style={{ backgroundColor: '#FFAA2B' }}>
          <IconWrapper>
        <AddCommentIcon />
        </IconWrapper>
          Registrar Cliente
        </Button>
      </div>
      <div className="tableCustomers">
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
  )
}

export default Customers;