import './styles.css';

import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AddCommentIcon from '@mui/icons-material/AddComment';
import Button from '@mui/material/Button';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useApi } from '../../hooks/useApi';
import { UUID } from 'crypto';

type Product = {
  product_id: UUID;
  name: string;
  description: string;
  categoryName: string;
  brand: string;
  stock: number;
  price: number;
  cost: number;
};

type Props = {}

const IconWrapper = styled('span')({
  display: 'flex',
  alignItems: 'center',
  marginRight: '8px',
});


const Products = (props: Props) => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext); 
  const api = useApi();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; 
 
  useEffect(() => {
    const getProducts = async(token: string | null) => {
      try { 
        if(token?.includes) {
          const products = await api.getAllProducts(token);
          const reverseProducts = products.reverse();
          setProducts(reverseProducts);        
        }
      } catch (err) { 
        console.log(err);  
      }     
    } 

    getProducts(token);
  }, []) 
 
  const handleAddProduct = () => {
    navigate('/addproduct'); 
  }

  const handleSingleProduct = (id: string) => {
    navigate(`/singleproduct/${id}`)
  }

  useEffect(() => {
    const searchTextLower = searchText.toLowerCase();
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTextLower) ||
      product.categoryName.toLowerCase().includes(searchTextLower) ||
      product.product_id.toLowerCase().includes(searchTextLower)
    );
    setFilteredProducts(filtered);
  }, [searchText, products]);


const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

const handlePageChange = (pageNumber: number) => {
  setCurrentPage(pageNumber);
};

const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
const pageNumbers = [];
for (let i = 1; i <= totalPages; i++) {
  pageNumbers.push(i);
}

  return (
    <div>
      <div className="inputContainer">
        <input 
          type="text"
          placeholder='Buscar produto por nome, id ou categoria.'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddProduct} disableElevation style={{ backgroundColor: '#FFAA2B' }}>
          <IconWrapper>
        <AddCommentIcon />
        </IconWrapper>
          Registrar Produto
        </Button>
      </div>
      <div className="tableProducts">
      <table>
        <thead>
          <tr>
            <th scope="col">Produto</th>
            <th scope="col">Categoria</th>
            <th scope="col">Valor</th>
            <th scope="col">ID</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product.product_id} onClick={() => handleSingleProduct(product.product_id)}>
              <td data-label="PRODUTO">{product.name}</td>
              <td data-label="CATEGORIA">{product.categoryName}</td>
              <td data-label="VALOR">R$ {product.price.toFixed(2)}</td>
              <td data-label="ID">{product.product_id}</td>
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

export default Products;