import './styles.css';

import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AddCommentIcon from '@mui/icons-material/AddComment';
import Button from '@mui/material/Button';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useApi } from '../../hooks/useApi';
import { UUID } from 'crypto';


type Category = {
  category_id: UUID;
  name: string;
  description: string;
  products: [];
  createdAt: string;
};

type Props = {}

const IconWrapper = styled('span')({
  display: 'flex',
  alignItems: 'center',
  marginRight: '8px',
});


const Categories = (props: Props) => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext); 
  const api = useApi();

  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; 

  useEffect(() => {
    const getCategories = async(token: string | null) => {
      try { 
        if(token?.includes) {
          const categoryList = await api.getAllCategories(token);
          const reverseCategoryProductList = categoryList.reverse();
          setCategories(reverseCategoryProductList);
        }
      } catch (err) {
        console.log(err);  
      }     
    }  

    getCategories(token);
  }, []) 

  const handleAddCategory = () => {
    navigate('/addcategory');
  }

  const handleSingleCategory = (id: string) => {
    navigate(`/singlecategory/${id}`);
  }


  useEffect(() => {
    const searchTextLower = searchText.toLowerCase();
    const filtered = searchTextLower
      ? categories.filter((category) =>
        category.name.toLowerCase().includes(searchTextLower) ||
        category.category_id.toLowerCase().includes(searchTextLower)
        )
      : categories; 
    setFilteredCategories(filtered);
  }, [searchText, categories]); 


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
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);


  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

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
      <div className="tableCategories">
      <table>
        <thead>
          <tr>
            <th scope="col">Categoria</th>
            <th scope="col">ID</th>
            <th scope="col">Produtos</th>
            <th scope="col">Data criação</th>
          </tr>
        </thead>
        <tbody>
          {currentCategories.map((category) => (
            <tr key={category.category_id} onClick={() => handleSingleCategory(category.category_id)}>
              <td data-label="CATEGORIA">{category.name}</td>
              <td data-label="ID">{category.category_id}</td>
              <td data-label="CLIENTES">{category.products.length}</td>
              <td data-label="DATA CRIAÇÃO">{formatDate(category.createdAt)}</td>
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

export default Categories;