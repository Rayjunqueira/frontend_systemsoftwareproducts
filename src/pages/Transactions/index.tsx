import './styles.css';

import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AddCommentIcon from '@mui/icons-material/AddComment';
import Button from '@mui/material/Button';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useApi } from '../../hooks/useApi';
import { UUID } from 'crypto';

type Transaction = {
  transaction_id: UUID;
  name: string;
  transactionNumber: string;
  status: boolean;
  totalValue: number;
  createdHour: string;
  createdAt: string;
};


type Props = {}

const IconWrapper = styled('span')({
  display: 'flex',
  alignItems: 'center',
  marginRight: '8px',
});

 
const Transactions = (props: Props) => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const api = useApi();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const compareDates = (a: Transaction, b: Transaction) => {
    const dateA = new Date(a.createdAt) as any;
    const dateB = new Date(b.createdAt) as any;
  
    return dateB - dateA;
  };

  const getStatusClass = (status: boolean) => {
    return status ? 'green' : 'red';
  };  

  useEffect(() => {
    const getTransactions = async (token: string | null) => {
      try {
        if (token?.includes) {
          const transactions = await api.getAllTransactions(token);
          const reverseTransactions = transactions.reverse(compareDates);
          setTransactions(reverseTransactions);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getTransactions(token);
  }, []);

  const handleAddTransaction = () => {
    navigate('/addtransaction');
  }

  const handleSingleTransaction = (id: string) => {
    navigate(`/singleTransaction/${id}`)
  }

  useEffect(() => {
    const searchTextLower = searchText.toLowerCase();
    const filtered = transactions.filter(
      (transaction) =>
        transaction.transactionNumber.toLowerCase().includes(searchTextLower) ||
        transaction.name.toLowerCase().includes(searchTextLower) ||
        transaction.createdAt.toLowerCase().includes(searchTextLower)
    );
    setFilteredTransactions(filtered);
  }, [searchText, transactions]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString); 
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  return (
    <div>
      <div className="inputContainer">
        <input 
          type="text" 
          placeholder='Buscar transação por nome, id ou data.'
        />
        <Button variant="contained" onClick={handleAddTransaction} disableElevation style={{ backgroundColor: '#FFAA2B' }}>
          <IconWrapper>
        <AddCommentIcon /> 
        </IconWrapper>
          Registrar Transação
        </Button>
      </div>
      <div className="tableTransactions">
      <table>
        <thead>
          <tr>
            <th scope="col">N de Transação</th>
            <th scope="col">Título</th>
            <th scope="col">Valor</th>
            <th scope="col">Data</th>
          </tr>
        </thead>
        <tbody>
            {currentTransactions.map((transaction) => (
              <tr
                key={transaction.transaction_id}
                onClick={() => handleSingleTransaction(transaction.transaction_id)}
              >
                <td data-label="N DA TRANSAÇÃO">{transaction.transactionNumber}</td>
                <td data-label="NOME">{transaction.name}</td>
                <td
                  data-label="VALOR TOTAL"
                  className={getStatusClass(transaction.status)}
                >
                  {transaction.status ? '+' : '-'}<strong>R$ {transaction.totalValue.toFixed(2)}</strong>
                </td>
                <td data-label="DATA">{formatDate(transaction.createdAt)}</td>
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

export default Transactions;