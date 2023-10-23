import React, { useContext, useEffect, useState } from 'react';
import './styles.css';
import { useApi } from '../../hooks/useApi';
import { AuthContext } from '../../contexts/AuthContext';
import { useParams } from 'react-router-dom';

type Props = {};

const DeleteStock = (props: Props) => {
  const api = useApi();
  const { id } = useParams();
  const { token } = useContext(AuthContext);

  const [product, setProduct] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [addStock, setAddStock] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [productCategoryId, setProductCategoryId] = useState<string>("");
  const [productCategoryName, setProductCategoryName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [totalCost, setTotalCost] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    const getSingleProduct = async (id: string | undefined, token: string | undefined) => {
      try {
        if (token?.includes) {
          const singleProduct = await api.getProductById(id, token!);
          console.log(singleProduct)
          setProduct(singleProduct.name);
          setProductCategoryId(singleProduct.categoryIdentification);  
          setStock(singleProduct.stock);
          setDescription(singleProduct.description);
          setBrand(singleProduct.brand);
          setProductCategoryName(singleProduct.categoryName);
          setPrice(singleProduct.price);
          setCost(singleProduct.cost);
        }
      } catch (err) {
        console.log(err);
      }
    }

    getSingleProduct(id, token!);
  }, []);

  const handleSaveUpdate = async () => {
    if (token && id) {
      try {
        const newStock = parseInt(stock) - parseInt(addStock);
          if (newStock < 0) {
            const zeroStock = 0;
            const updateProduct = await api.updateProduct(id, product, productCategoryName, productCategoryId, description, brand, zeroStock, parseFloat(totalCost), parseFloat(price), token);
          } else {
            const updateProduct = await api.updateProduct(id, product, productCategoryName, productCategoryId, description, brand, newStock, parseFloat(totalCost), parseFloat(price), token);
          }
          setIsCreate(true);
      } catch (err) {
        console.log(err);
      }
    } 
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    handleSaveUpdate(); 
  };
  
  return (
    <form className="customerCategory-form">
      <label htmlFor="customerCategoryName">Quantidade a remover:</label>
      <input
        type="text"
        id="productName"
        name="productName"
        placeholder='Quantidade...'
        value={addStock}
        onChange={e => setAddStock(e.target.value)}
      />

      <button type="button" onClick={handleFormSubmit}>Remover estoque</button>
      {nameError && <p className="error-message">{nameError}</p>}
      {isCreate ? (
        <p>Estoque removido!</p>
      ) : <p className="error-message">{errorMessage}</p>}
    </form>
  );
};

export default DeleteStock;
