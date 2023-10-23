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

const AddTransaction = (props: Props) => {
  const api = useApi();
  const { token } = useContext(AuthContext);

  const [name, setName] = useState<string>("");
  const [status, setStatus] = useState<boolean>(true);
  const [totalValue, setTotalValue] = useState<string>("");

  const [statusTransaction, setStatusTransaction] = useState<string>(""); 

  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSaveProduct = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
  
    if (token) {
      const product = await api.createTransaction(name, status, parseFloat(totalValue), token);
    
      if (product.success) {
        setIsCreate(true);
        setName("");
        setTotalValue("");

      } else {
        setErrorMessage("Ocorreu um erro!.");
        console.log(product.error);
      }
    } else {
      console.error("Token é nulo. Não é possível realizar a operação.");
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "Receita") {
      setStatus(true);
    } else if (event.target.value === "Despesa") {
      setStatus(false);
    }
    setStatusTransaction(event.target.value); 
  };


  return (
    <form className="transaction-form">
      <label htmlFor="transactionName">Nome da transação:</label>
      <input 
        type="text" 
        id="transactionName" 
        name="transactionName" 
        placeholder='Nome da transação...'
        value={name}
        onChange={e => setName(e.target.value)}
      />

    <label htmlFor="transactionStatus">Status:</label>
      <select
        id="status"
        name="status"
        value={statusTransaction} 
        onChange={handleStatusChange} 
      >
        <option value="">Selecione o status</option>
        <option>
          Receita
        </option>        
        <option>
          Despesa
        </option>
      </select>

      <label htmlFor="transactionDescription" placeholder='Descrição...'>Descrição do Produto (opcional):</label>
      <textarea id="transactionDescription" name="productDescription" />

      <label htmlFor="transactionName">Valor:</label>
      <input 
        type="text" 
        id="transactionName" 
        name="transactionName" 
        placeholder='Valor...'
        value={totalValue}
        onChange={e => setTotalValue(e.target.value)}
      />

      <button type="submit" onClick={handleSaveProduct}>Cadastrar Transação</button>
      {isCreate ? (
            <p>Transação criada!</p>
        ) : <p className="error-message">{errorMessage}</p>}     
    </form>
  );
};

export default AddTransaction;
