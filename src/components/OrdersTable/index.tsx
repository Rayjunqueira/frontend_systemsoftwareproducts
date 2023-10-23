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
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  fontFamily: 'Kanit, sans-serif',
  color: '#333',
}));

interface RowData {
  id: number;
  cliente: string; // Adiciona a propriedade "cliente"
  data: string;
  valorTotal: string;
}

function createData(
  id: number,
  data: string,
  cliente: string,
  valorTotal: string,
): RowData {
  return { id, data, cliente, valorTotal };
}

const rows: RowData[] = [
  createData(1, 'João', '2023-07-24', '100.00'), // Inclui o nome do cliente
  createData(2, 'Maria', '2023-07-23', '75.50'),
  createData(3, 'Pedro', '2023-07-22', '200.00'),
  // Adicione mais dados conforme necessário
];

export default function OrdersTable() {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSingleCustomer = () => {
    navigate('/singleorder')
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
    const searchTermLower = searchTerm.toLowerCase();
    return (
      row.id.toString().includes(searchTermLower) ||
      row.cliente.toLowerCase().includes(searchTermLower) || // Inclui o nome do cliente na busca
      row.data.toLowerCase().includes(searchTermLower) ||
      row.valorTotal.toLowerCase().includes(searchTermLower)
    );
  });

  const slicedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const inputStyles = {
    backgroundColor: 'white',
    borderRadius: '4px',
  };

  return (
    <div>
      {/* Adicione o campo de busca */}
      <TextField
        label="Buscar pedido por nome, id, ou data..."
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
              <StyledTableCell>Id</StyledTableCell>
              <StyledTableCell>Cliente</StyledTableCell> {/* Adiciona a coluna "Cliente" */}
              <StyledTableCell>Data</StyledTableCell>
              <StyledTableCell>Valor total</StyledTableCell>
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
                <TableCell>{row.data}</TableCell>
                <TableCell>{row.cliente}</TableCell> {/* Exibe o nome do cliente */}
                <TableCell>{row.valorTotal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
