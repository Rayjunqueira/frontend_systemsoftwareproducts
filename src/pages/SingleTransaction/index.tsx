import './styles.css';

import EditIcon from '@mui/icons-material/Edit';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import { useContext, useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { UUID } from 'crypto';
 
type Props = {}

const SingleTransaction = (props: Props) => {
  const api = useApi();
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [customerToken, setCustomerToken] = useState<string>("");
  const [transactionNumber, setTransactionNumber] = useState<string>("");
  const [transactionName, setTransactionName] = useState<string>("");
  const [status, setStatus] = useState<boolean>(false);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [createdAt, setCreatedAt] = useState<string>("");
  const [createdHour, setCreatedHour] = useState<string>("");

  useEffect(() => {
    const getTransaction = async (id: string | undefined, token: string | undefined) => {
      try { 
        if (token !== null && id !== undefined) {
          const transaction = await api.getTransactionById(id, token!);
          setTransactionNumber(transaction.transaction_number);
          setTransactionName(transaction.name);
          setTotalValue(transaction.totalValue);
          setStatus(transaction.status);
          setCreatedAt(transaction.createdAt);
          setCreatedHour(transaction.createdHour);
          setCustomerToken(token || "");
        } 
      } catch (err) {
        console.log(err); 
      }     
    } 

    getTransaction(id, token!);
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

  const handleRemoveTransaction = async () => {
    await api.deleteTransactionById(id, customerToken);
    navigate("/transactions")
  }

  return (
    <div className="transaction-container">
      <div className="transaction-invoice">
        <div className="header">
          <h2>TRANSAÇÃO N {transactionNumber}</h2>
        </div>
        <div className="transaction-info">
          <p id='client'>{transactionName}</p>
          <p id='client'>Status: Custo</p>
          <p id='cellphone'>{formatDate(createdAt)} ás {createdHour}</p>
          <hr />
        </div>
        <div className="transaction-details">
          <p>Valor total: <i id={status ? 'positive' : 'negative'}> R$ {totalValue.toFixed(2)}</i></p>
          <hr />
          <div className="icons">
            <i id='remove-icon' onClick={handleRemoveTransaction}><DoNotDisturbAltIcon /></i>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleTransaction;