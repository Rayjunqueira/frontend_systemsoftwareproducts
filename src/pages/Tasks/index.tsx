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

  
const Tasks = (props: Props) => {
    const handleAddProduct = () => {
    }
    
  return (
    <div>
        <div className="inputContainer">
            <input 
            type="text" 
            placeholder='Digitar atividade a realizar.'
            />
            <Button variant="contained" onClick={handleAddProduct} disableElevation style={{ backgroundColor: '#FFAA2B' }}>
            <IconWrapper>
            <AddCommentIcon />
            </IconWrapper>
            Adicionar atividade
            </Button>
        </div>
        <div className="container">
            <h1>Atividades Pendentes</h1>
            <ul>
                <li>
                    <span className="task">Tarefa 1</span>
                    <button className="delete-button">Excluir</button>
                    <button className="edit-button">Editar</button>
                    <button className="complete-button">Finalizar</button>
                </li>
                <li>
                    <span className="task">Tarefa 2</span>
                    <button className="delete-button">Excluir</button>
                    <button className="edit-button">Editar</button>
                    <button className="complete-button">Finalizar</button>
                </li>
                <li>
                    <span className="task">Tarefa 3</span>
                    <button className="delete-button">Excluir</button>
                    <button className="edit-button">Editar</button>
                    <button className="complete-button">Finalizar</button>
                </li>
            </ul>
        </div>
    </div>
    )
}

export default Tasks;