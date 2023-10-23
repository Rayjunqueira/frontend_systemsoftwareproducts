import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { styled, Theme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

const StyledTableCell = styled(TableCell)(({ theme }: { theme: Theme }) => ({
  fontWeight: 'bold',
  fontFamily: 'Kanit, sans-serif',
  color: '#333',
}));

interface RowData {
  id: number;
  transação: string;
  valorTotal: number;
  data: string;
}

function createData(
  id: number,
  transação: string,
  valorTotal: number,
  data: string,
): RowData {
  return { id, transação, valorTotal, data };
}

const rows: RowData[] = [
  createData(1, 'COMPRA DE 30 ESCOVAS PROGRESSIVAS', -177.0, '2023-07-26'),
  createData(2, 'COMPRA DE 3 MATIZADORES', -30.0, '2023-07-25'),
  createData(3, 'PAGAMENTO DE PEDIDO', 70.0, '2023-07-24'),
  createData(3, 'PAGAMENTO DE PRODUTO', 170.0, '2023-07-24'),
  // Add more data as needed
];

const ValorTotalCell = styled('span')<{ valorTotal: number }>(({ valorTotal }: { valorTotal: number }) => ({
  color: valorTotal >= 0 ? 'green' : 'red',
  fontFamily: 'Kanit, sans-serif',
}));

export default function TransactionTable() {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSingleCustomer = () => {
    navigate('/singletransaction');
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
      row.transação.toLowerCase().includes(searchTermLower) ||
      row.valorTotal.toFixed(2).includes(searchTermLower) ||
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
      {/* Search input field */}
      <TextField
        label="Buscar transação por nome, id ou data..."
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
        InputProps={{
          style: inputStyles,
        }}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Id</StyledTableCell>
              <StyledTableCell>Transação</StyledTableCell>
              <StyledTableCell>Valor Total</StyledTableCell>
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
                <TableCell>{row.transação}</TableCell>
                <TableCell>
                  <ValorTotalCell valorTotal={row.valorTotal}>
                    {row.valorTotal >= 0 ? '+' : '-'}
                    {Math.abs(row.valorTotal).toFixed(2)}
                  </ValorTotalCell>
                </TableCell>
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
