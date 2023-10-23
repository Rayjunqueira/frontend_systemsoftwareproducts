import './styles.css';

import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AddCommentIcon from '@mui/icons-material/AddComment';
import Button from '@mui/material/Button';
import { UUID } from 'crypto';
import { useApi } from '../../hooks/useApi';
import { useContext, useEffect, useState } from 'react';
import { format } from 'path';
import { AuthContext } from '../../contexts/AuthContext';

type CustomerCategory = {
  customer_category_id: UUID;
  name: string;
  description: string;
  customers: [];
  createdAt: string;
};

type Props = {}

const IconWrapper = styled('span')({
  display: 'flex',
  alignItems: 'center',
  marginRight: '8px',
});

 
const CustomerCategories = (props: Props) => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext); 
  const api = useApi();

  const [customerCategories, setCustomerCategories] = useState<CustomerCategory[]>([]);
  const [filteredCustomerCategories, setFilteredCustomerCategories] = useState<CustomerCategory[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; 

  useEffect(() => {
    const getCustomerCategories = async(token: string | null) => {
      try { 
        if(token?.includes) {
          const customerCategoryList = await api.getAllCustomerCategories(token);
          const reverseCategoryList = customerCategoryList.reverse();
          setCustomerCategories(reverseCategoryList);
        }
      } catch (err) {
        console.log(err);  
      }     
    } 

    getCustomerCategories(token);
  }, []) 

  const handleAddCategory = () => {
    navigate('/addcustomercategory');
  }

  const handleSingleCustomerCategory = (id: string) => {
    navigate(`/singlecustomercategory/${id}`)
  }

  useEffect(() => {
    const searchTextLower = searchText.toLowerCase();
    const filtered = searchTextLower
      ? customerCategories.filter((customerCategory) =>
          customerCategory.name.toLowerCase().includes(searchTextLower) ||
          customerCategory.customer_category_id.toLowerCase().includes(searchTextLower)
        )
      : customerCategories; 
    setFilteredCustomerCategories(filtered);
  }, [searchText, customerCategories]); 

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomerCategories = filteredCustomerCategories.slice(indexOfFirstItem, indexOfLastItem);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString); // Converter a string para um objeto Date
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
  
    // Formate os números de mês e dia para sempre ter dois dígitos
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
  
    return `${formattedDay}/${formattedMonth}/${year}`;
  };
  
  const totalPages = Math.ceil(filteredCustomerCategories.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div>
      <div className="inputContainer">
        <input 
          type="text" 
          placeholder='Buscar categoria por nome, id ou data de criação.'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddCategory} disableElevation style={{ backgroundColor: '#FFAA2B' }}>
          <IconWrapper>
        <AddCommentIcon />
        </IconWrapper>
          Registrar Categoria
        </Button> 
      </div>
      <div className="customerCategories">
      <table>
        <thead>
          <tr>
            <th scope="col">Categoria</th>
            <th scope="col">ID</th>
            <th scope="col">Clientes</th>
            <th scope="col">Data criação</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomerCategories.map((customerCategory) => (
            <tr key={customerCategory.customer_category_id} onClick={() => handleSingleCustomerCategory(customerCategory.customer_category_id)}>
              <td data-label="CATEGORIA">{customerCategory.name}</td>
              <td data-label="ID">{customerCategory.customer_category_id}</td>
              <td data-label="CLIENTES">{customerCategory.customers.length}</td>
              <td data-label="DATA CRIAÇÃO">{formatDate(customerCategory.createdAt)}</td>
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

export default CustomerCategories;