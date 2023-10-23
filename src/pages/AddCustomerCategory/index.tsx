import React, { useContext, useEffect, useState } from 'react';
import './styles.css';
import { useApi } from '../../hooks/useApi';
import { AuthContext } from '../../contexts/AuthContext';

type Props = {};

const AddCustomerCategory = (props: Props) => {
  const api = useApi();
  const { token } = useContext(AuthContext);

  const [categoryName, setCategoryName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [customerList, setCustomerList] = useState<[]>([]);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const handleSaveCategory = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    setNameError(null);
    setErrorMessage(null);

    if (!categoryName) {
      setNameError("Você precisa digitar o nome da categoria.");
      return;
    }

    if (token) {
      const customerCategory = await api.createCustomerCategory(categoryName, description, customerList, token);

      if (customerCategory.success) {
        setIsCreate(true);
        setCategoryName("");
        setDescription("");
      } else {
        setErrorMessage("Essa categoria já existe no banco de dados! Tente criar outra.");
      }
    } else {
      console.error("Token é nulo. Não é possível realizar a operação.");
    }
  };

  return (
    <form className="customerCategory-form">
      <label htmlFor="customerCategoryName">Nome da categoria:</label>
      <input
        type="text"
        id="productName"
        name="productName"
        placeholder='Nome de categoria...'
        value={categoryName}
        onChange={e => setCategoryName(e.target.value)}
      />

      <label
        htmlFor="productDescription"
        placeholder='Descrição...'>Descrição da categoria (opcional):</label>
      <textarea
        id="productDescription"
        name="productDescription"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <button type="submit" onClick={handleSaveCategory}>Cadastrar Categoria</button>
      {nameError && <p className="error-message">{nameError}</p>}
      {isCreate ? (
        <p>Categoria criada!</p>
      ) : <p className="error-message">{errorMessage}</p>}
    </form>
  );
};

export default AddCustomerCategory;
