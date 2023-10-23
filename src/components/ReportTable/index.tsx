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
  mes: string; // Change to "mes" (Month)
  data: string; // Change to "data" (Date)
}

function createData(
  id: number,
  mes: string,
  data: string,
): RowData {
  return { id, mes, data };
}

const rows: RowData[] = [
  createData(1, 'Julho', '28/07/2023'), // Example data (Replace with actual data)
  createData(2, 'Junho', '28/06/2023'),
  createData(3, 'Maio', '28/05/2023'),
  // Add more data as needed
];

export default function ReportTable() {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSingleCustomer = () => {
    navigate('/singlereport');
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
      row.mes.toLowerCase().includes(searchTermLower) || // Search by "mes" (Month)
      row.data.includes(searchTermLower) // Search by "data" (Date)
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
        label="Buscar mês ou data..."
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
              <StyledTableCell>Mês</StyledTableCell> {/* Change to "Mês" */}
              <StyledTableCell>Data</StyledTableCell> {/* Change to "Data" */}
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
                <TableCell>{row.mes}</TableCell> {/* Display "Mês" */}
                <TableCell>{row.data}</TableCell> {/* Display "Data" */}
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
