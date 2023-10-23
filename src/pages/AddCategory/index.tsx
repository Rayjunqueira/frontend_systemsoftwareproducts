import React, { useContext, useState } from 'react';
import './styles.css';
import { useApi } from '../../hooks/useApi';
import { AuthContext } from '../../contexts/AuthContext';

type Props = {};

const AddCategory = (props: Props) => {
  const api = useApi();
  const { token } = useContext(AuthContext);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [productList, setProductList] = useState<[]>([]);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const handleSaveCategory = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    setNameError(null);
    setErrorMessage(null);

    if (!name) {
      setNameError("Você precisa digitar o nome da categoria.");
      return;
    }

    if (token) {
      const category = await api.createCategory(name, description, productList, token);

      if (category.success) {
        setIsCreate(true);
        setName("");
        setDescription("");
      } else {
        setErrorMessage("Essa categoria já existe no banco de dados! Tente criar outra.");
      }
    } else {
      console.error("Token é nulo. Não é possível realizar a operação.");
    }
  };

  return (
    <form className="product-form">
      <label htmlFor="productName">Nome da categoria:</label>
      <input
        type="text"
        id="productName"
        name="productName"
        placeholder='Nome de categoria...'
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <label htmlFor="productDescription" placeholder='Descrição...'>Descrição da categoria (opcional):</label>
      <textarea
        id="productDescription"
        name="productDescription"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <button type="submit" onClick={handleSaveCategory}>Cadastrar Categoria</button>
      {isCreate ? (
        <p>Categoria criada!</p>
      ) : null}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {nameError && <p className="error-message">{nameError}</p>}
    </form>
  );
};

export default AddCategory;
