import React, { useContext, useEffect, useState } from 'react';
import './styles.css';
import { useApi } from '../../hooks/useApi';
import { AuthContext } from '../../contexts/AuthContext';
import { UUID } from 'crypto';

type CustomerCategory = {
  customer_category_id: UUID;
  name: string;
  description: string;
  customers: [];
  createdAt: string;
};

type Props = {};

const AddCustomer = (props: Props) => {
  const api = useApi();
  const { token } = useContext(AuthContext);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [customerCategoryId, setCustomerCategoryId] = useState<string>("");
  const [cellphone1, setCellphone1] = useState<string>("");
  const [cellphone2, setCellphone2] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [customerCategories, setCustomerCategories] = useState<CustomerCategory[]>([]);

  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  useEffect(() => {
    const getCustomerCategories = async (token: string | null) => {
      try {
        if (token?.includes) {
          const customerCategoryList = await api.getAllCustomerCategories(token);
          setCustomerCategories(customerCategoryList);
        }
      } catch (err) {
        console.log(err);
      }
    }

    getCustomerCategories(token);
  }, []);

  const handleSaveCustomer = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (!cellphone1) {
      setPhoneError("O telefone deve ser preenchido.");
    } else {
      setPhoneError(null);
    }

    if (!customerCategoryId) {
      setCategoryError("Você precisa escolher uma categoria.");
    } else {
      setCategoryError(null);
    }

    if (token) {
      if (cellphone1 && customerCategoryId) {
        // Restante do código para criar o cliente
        const customer = await api.createCustomer(name, customerCategoryId, email, cellphone1, cellphone2, note, token);

        if (customer.success) {
          setIsCreate(true);
          setName("");
          setEmail("");
          setCellphone1("");
          setCellphone2("");
          setNote("");
        } else {
          setErrorMessage("Esse cliente já existe no banco de dados! Tente criar outro.");
        }
      }
    } else {
      console.error("Token é nulo. Não é possível realizar a operação.");
    }
  };

  return (
    <form className="customer-form">
      <label htmlFor="customerName">Nome do Cliente:</label>
      <input
        type="text"
        id="customerName"
        name="customerName"
        placeholder='Nome do cliente...'
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <label htmlFor="customerCategory">Categoria:</label>
      <select
        id="customerCategory"
        name="customerCategory"
        value={customerCategoryId}
        onChange={(e) => setCustomerCategoryId(e.target.value)}
      >
        <option value="">Selecione uma categoria</option>
        {customerCategories.map((category) => (
          <option key={category.customer_category_id} value={category.customer_category_id}>
            {category.name}
          </option>
        ))}
      </select>

      <label htmlFor="customerEmail">E-mail(opcional):</label>
      <input
        type="email"
        id="customerEmail"
        name="customerEmail"
        placeholder='E-mail de contato...'
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <label htmlFor="customerCellphone1">Número de telefone:</label>
      <input
        type="text"
        id="customerCellphone1"
        name="customerCellphone1"
        placeholder='Telefone de contato...'
        value={cellphone1}
        onChange={e => setCellphone1(e.target.value)}
      />
      
      <label htmlFor="customerCellphone2">Número de telefone secundário(opcional):</label>
      <input
        type="text"
        id="customerCellphone2"
        name="customerCellphone2"
        placeholder='Telefone de contato 2...'
        value={cellphone2}
        onChange={e => setCellphone2(e.target.value)}
      />

      <label htmlFor="customerNote">Anotações(opcional):</label>
      <textarea
        name="notes"
        placeholder='Anotações...'
        value={note}
        onChange={e => setNote(e.target.value)}
      ></textarea>

      <button type="submit" onClick={handleSaveCustomer}>Cadastrar Cliente</button>

      <div className="error-container">
        {phoneError && <p className="error-message">{phoneError}</p>}
        {categoryError && <p className="error-message">{categoryError}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

      {isCreate ? (
        <p>Cliente criado!</p>
      ) : null}
    </form>
  );
};

export default AddCustomer;
