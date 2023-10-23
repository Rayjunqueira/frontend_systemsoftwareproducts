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
  nome: string;
  numeroClientes: number; // Change "estoque" to "numeroClientes"
  data: string;
}

function createData(
  id: number,
  nome: string,
  numeroClientes: number, // Change "estoque" to "numeroClientes"
  data: string,
): RowData {
  return { id, nome, numeroClientes, data }; // Change "estoque" to "numeroClientes"
}

const rows: RowData[] = [
  createData(1, 'Shampoo', 10, '2023-07-28'), // Change the value for "numeroClientes"
  createData(2, 'Escova', 5, '2023-07-29'), // Change the value for "numeroClientes"
  createData(3, 'Progressiva', 15, '2023-07-30'), // Change the value for "numeroClientes"
  // Add more data as needed
];

export default function CategoriesTableCustomers() {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSingleCustomer = () => {
    navigate('/singlecategory');
  };

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
      row.nome.toLowerCase().includes(searchTermLower) ||
      row.numeroClientes.toString().includes(searchTermLower) || // Change to "numeroClientes"
      row.data.includes(searchTermLower)
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
        label="Buscar categoria por nome, id, ou data..."
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
              <StyledTableCell>Nome</StyledTableCell>
              <StyledTableCell>Número de Clientes</StyledTableCell> {/* Change to "Número de Clientes" */}
              <StyledTableCell>Data</StyledTableCell>
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
                <TableCell>{row.numeroClientes}</TableCell> {/* Change to "numeroClientes" */}
                <TableCell>{row.data}</TableCell>
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
