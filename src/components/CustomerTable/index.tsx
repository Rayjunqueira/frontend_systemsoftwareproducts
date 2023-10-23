import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { styled } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField'; // Importe o componente TextField
import { useNavigate } from 'react-router-dom';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  fontFamily: 'Kanit, sans-serif',
  color: '#333',
}));

interface RowData {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  categoria: string;
}

function createData(
  id: number,
  nome: string,
  telefone: string,
  email: string,
  categoria: string,
): RowData {
  return { id, nome, telefone, email, categoria };
}

const rows: RowData[] = [
  createData(1, 'João', '(11) 1234-5678', 'joao@email.com', 'Cliente'),
  createData(2, 'Maria', '(21) 9876-5432', 'maria@email.com', 'Cliente'),
  createData(3, 'Pedro', '(31) 9999-8888', 'pedro@email.com', 'Fornecedor'),
  createData(4, 'Ana', '(41) 7777-2222', 'ana@email.com', 'Cliente'),
  createData(5, 'Carlos', '(51) 5555-1111', 'carlos@email.com', 'Fornecedor'),
];

export default function CustomerTable() {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSingleCustomer = () => {
    navigate('/singlecustomer')
  }

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredRows = rows.filter((row) => {
    // Converte o termo de busca para letras minúsculas para tornar a busca não case-sensitive
    const searchTermLower = searchTerm.toLowerCase();
    
    // Verifica se o termo de busca corresponde a qualquer campo (ID, nome, telefone, email ou categoria)
    return (
      row.id.toString().includes(searchTermLower) || // Busca por ID
      row.nome.toLowerCase().includes(searchTermLower) || // Busca por nome
      row.telefone.includes(searchTerm) || // Busca por telefone
      row.email.toLowerCase().includes(searchTermLower) || // Busca por e-mail
      row.categoria.toLowerCase().includes(searchTermLower) // Busca por categoria
    );
  });

  const slicedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const inputStyles = {
    // Estilos do input
    backgroundColor: 'white', // Cor de fundo branca
    borderRadius: '4px',
  };

  return (
    <div>
      {/* Adicione o campo de busca */}
      <TextField
        label="Buscar cliente por nome, id, email ou telefone..."
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
        InputProps={{
          style: inputStyles,
        }}
        InputLabelProps={{
          style: { 
            textAlign: 'center',
            transform: searchTerm ? 'translate(0, -1.5rem) scale(0.75)' : 'none',
            transition: 'transform 0.2s',
          },
        }}      
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Nome</StyledTableCell>
              <StyledTableCell>Telefone</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Categoria</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slicedRows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                onClick={() => handleSingleCustomer()}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>{row.nome}</TableCell>
                <TableCell>{row.telefone}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.categoria}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length} // Use o total de linhas filtradas
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
