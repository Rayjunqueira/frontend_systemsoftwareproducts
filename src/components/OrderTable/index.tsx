import * as React from 'react';
import './styles.css';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

interface Column {
  id: 'date' | 'customer' | 'saleAmount';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'date', label: 'Data', minWidth: 170 },
  { id: 'customer', label: 'Clientes', minWidth: 100 },
  {
    id: 'saleAmount',
    label: 'Valor Total',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
];

interface Data {
  date: string;
  customer: string;
  saleAmount: number;
}

function createData(
  date: string,
  customer: string,
  saleAmount: number,
): Data {
  return { date, customer, saleAmount };
}

const rows = [
  createData('23 Jul, 2023', 'John Doe', 100.87),
  createData('23 Jul, 2023', 'Jane Smith', 200.43),
  createData('23 Jul, 2023', 'Bob Johnson', 150.34),
  // Adicione mais linhas de acordo com suas necessidades.
];

export default function OrderTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '86%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440, boxShadow: '0px 4px 6px rgba(1, 1, 1, 0.7)' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    fontFamily: 'Kanit, sans-serif', // Adicionando a fonte Kanit
                    fontSize: '1rem', // Pode ajustar o tamanho da fonte aqui se necessário
                    fontWeight: 'bold', // Adicionando negrito para destacar
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.date}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ fontFamily: 'Kanit, sans-serif' }} // Adicionando a fonte Kanit
                        >
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            <div className="MoreOrders">
              <a href="#">Pedidos completos</a>
            </div>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
