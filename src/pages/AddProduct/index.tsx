import React, { useContext, useEffect, useState } from 'react';
import './styles.css';
import { UUID } from 'crypto';
import { useApi } from '../../hooks/useApi';
import { AuthContext } from '../../contexts/AuthContext';

type ProductCategory = {
  category_id: UUID;
  name: string;
  description: string;
  customers: [];
  createdAt: string;
};

type Props = {};

const AddProduct = (props: Props) => {
  const api = useApi();
  const { token } = useContext(AuthContext);

  const [name, setName] = useState<string>("");
  const [productCategoryId, setProductCategoryId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [totalCost, setTotalCost] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);

  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [costError, setCostError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [stockError, setStockError] = useState<string | null>(null);
  const [brandError, setBrandError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    const getCategories = async (token: string | null) => {
      try {
        if (token?.includes) {
          const productCategoryList = await api.getAllCategories(token);
          setProductCategories(productCategoryList);
        }
      } catch (err) {
        console.log(err);
      }
    }

    getCategories(token);
  }, []);

  const handleSaveProduct = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    setNameError(null);
    setCategoryError(null);
    setCostError(null);
    setPriceError(null);
    setStockError(null);
    setBrandError(null);
    setErrorMessage(null);

    if (!name) {
      setNameError("Você precisa ter um nome para o produto.");
    }

    if (!productCategoryId) {
      setCategoryError("Você precisa selecionar uma categoria.");
    }

    if (!totalCost) {
      setCostError("Você precisa selecionar um valor de custo.");
    }

    if (!price) {
      setPriceError("Você precisa selecionar um valor comercial.");
    }

    if (!stock) {
      setStockError("Você precisa selecionar um estoque.");
    }

    if (!brand) {
      setBrandError("Você precisa selecionar uma marca.");
    }

    if (token && name && productCategoryId && totalCost && price && stock && brand) {
      const product = await api.createProduct(name, productCategoryId, description, brand, parseInt(stock), parseFloat(totalCost), parseFloat(price), token);

      if (product.success) {
        setIsCreate(true);
        setName("");
        setProductCategoryId("");
        setDescription("");
        setBrand("");
        setTotalCost("");
        setPrice("");
        setStock("");
      } else {
        setErrorMessage("Esse produto já existe no banco de dados! Tente criar outro.");
        console.log(product.error);
      }
    }
  };

  return (
    <form className="product-form">
      <label htmlFor="productName">Nome do Produto:</label>
      <input
        type="text"
        id="productName"
        name="productName"
        placeholder='Nome do produto...'
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <label htmlFor="productCategory">Categoria:</label>
      <select
        id="productCategory"
        name="productCategory"
        value={productCategoryId}
        onChange={(e) => setProductCategoryId(e.target.value)}
      >
        <option value="">Selecione uma categoria</option>
        {productCategories.map((category) => (
          <option key={category.category_id} value={category.category_id}>
            {category.name}
          </option>
        ))}
      </select>

      <label htmlFor="productDescription">Descrição do Produto (opcional):</label>
      <textarea
        id="productDescription"
        name="productDescription"
        placeholder='Descrição...'
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <label htmlFor="productTotalCost">Valor de custo:</label>
      <input
        type="text"
        id="productTotalCost"
        name="productTotalCost"
        placeholder='Valor de custo...'
        value={totalCost}
        onChange={e => setTotalCost(e.target.value)}
      />

      <label htmlFor="productPrice">Valor comercial:</label>
      <input
        type="text"
        id="productPrice"
        name="productPrice"
        placeholder='Valor comercial...'
        value={price}
        onChange={e => setPrice(e.target.value)}
      />

      <label htmlFor="productStock">Estoque:</label>
      <input
        type="text"
        id="productStock"
        name="productStock"
        placeholder='Estoque inicial...'
        value={stock}
        onChange={e => setStock(e.target.value)}
      />

      <label htmlFor="productBrand">Marca:</label>
      <input
        type="text"
        id="productBrand"
        name="productBrand"
        placeholder='Marca do produto...'
        value={brand}
        onChange={e => setBrand(e.target.value)}
      />

      <button type="submit" onClick={handleSaveProduct}>Cadastrar Produto</button>

      <div className="error-container">
        {nameError && <p className="error-message">{nameError}</p>}
        {categoryError && <p className="error-message">{categoryError}</p>}
        {costError && <p className="error-message">{costError}</p>}
        {priceError && <p className="error-message">{priceError}</p>}
        {stockError && <p className="error-message">{stockError}</p>}
        {brandError && <p className="error-message">{brandError}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

      {isCreate ? (
        <p>Produto criado!</p>
      ) : null}
    </form>
  );
};

export default AddProduct;
