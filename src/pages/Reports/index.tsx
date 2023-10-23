import './styles.css';

import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AddCommentIcon from '@mui/icons-material/AddComment';
import Button from '@mui/material/Button';


type Props = {}

const IconWrapper = styled('span')({
  display: 'flex',
  alignItems: 'center',
  marginRight: '8px',
});


const Reports = (props: Props) => {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate('/addproduct');
  }

  const handleSingleMonthReport = () => {
    navigate('/singlemonthreport')
  }

  return (
    <div>
      <div className="inputContainer">
        <input 
          type="text" 
          placeholder='Buscar relatório por mês'
        />
      </div>
      <div className="tableProducts">
      <table>
        <thead>
          <tr>
            <th scope="col">Mês</th>
            <th scope="col">Data</th>
          </tr>
        </thead>
        <tbody>
          <tr onClick={handleSingleMonthReport}>
            <td data-label="Mês">Janeiro 2023</td>
            <td data-label="Data">31/01 as 17:09</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default Reports;