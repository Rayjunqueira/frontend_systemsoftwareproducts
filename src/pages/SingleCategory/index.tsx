import { useNavigate, useParams } from 'react-router-dom';
import './styles.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useApi } from '../../hooks/useApi';
import { UUID } from 'crypto';

type Product = {
  product_id: UUID;
  createdAt: string;
  name: string;
  description: string;
  brand: string;
  stock: number;
  price: number;
  cost: number;
};

type Props = {}

const SingleProduct = (props: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const api = useApi();

  const [categoryName, setCategoryName] = useState<string>("");
  const [productNumber, setProductNumber] = useState<number>(0);
  const [categoryDate, setCategoryDate] = useState<string>("");
  const [categoryDescription, setCategoryDescription] = useState<string>("");
  const [categoryHour, setCategoryHour] = useState<string>("");
  const [productsInCategory, setProductsInCategory] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [customerToken, setCustomerToken] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    const getCategory = async (id: string | undefined, token: string | undefined) => {
      try { 
        if (token !== null && id !== undefined) {
          const categoryInfo = await api.getCategoryById(id, token!);
          setCategoryName(categoryInfo.name);
          setProductNumber(categoryInfo.products.length);
          setCategoryDescription(categoryInfo.description); 
          setCategoryDate(categoryInfo.createdAt);
          setCategoryHour(categoryInfo.createdHour);
          setProductsInCategory(categoryInfo.products);
          setCategoryId(categoryInfo.category_id);
          setCustomerToken(token || "");
        }
      } catch (err) {
        console.log(err); 
      }     
    } 

    getCategory(id, token!);
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

  const compareDates = (a: Product, b: Product) => {
    const dateA = new Date(a.createdAt) as any;
    const dateB = new Date(b.createdAt) as any;

    return dateB - dateA;
  };
   
  useEffect(() => {
    const getProductsByCategory = async (token: string | null) => {
      try {
        if (token?.includes) {
          const products = await api.getProductsByCategory(id, token);
          const sortedProducts = products.sort(compareDates);
          setProducts(sortedProducts);
          setFilteredProducts(sortedProducts); 
        }
      } catch (err) {
        console.log(err);
      }
    };

    getProductsByCategory(token);
  }, [id, token]);

  const handleSingleProduct = (id: string) => {
    navigate(`/singleproduct/${id}`);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteCategory = async (id: string | undefined, token: string) => {
    if (id && token) {
      await api.deleteCategoryById(id, token);
      navigate(`/categories`);
    }
  };

  return (
    <div>
      <div className="tableCategories"> 
        <table className="category-table">
          <tbody> 
            <tr>
              <td className="label">Nome:</td>
              <td className="value">{categoryName}</td> 
            </tr>
            <tr>
              <td className="label">Quantidade de produtos:</td>
              <td className="value">{productNumber}</td>
            </tr>
            <tr>
              <td className="label">Data de criação:</td>
              <td className="value">{formatDate(categoryDate)}</td>
            </tr>
            <tr>
              <td className="label">Horário de criação:</td>
              <td className="value">{categoryHour}</td>
            </tr>
          </tbody>
        </table>
        <div className="removeEditContainer">
            {products.length === 0 && (
              <div>
                <button id="edit">Editar</button>
                <button id="delete" onClick={() => handleDeleteCategory(categoryId, customerToken)}>Deletar</button>
              </div>
            )}
          </div>
        <div className="recentProducts">
          <h3>Produtos Recentes da categoria de {categoryName}</h3>
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
                  <td data-label="CATEGORIA">{categoryName}</td>
                  <td data-label="VALOR">R$ {product.price.toFixed(2)}</td>
                  <td data-label="ID">{product.product_id}</td>
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