import * as React from 'react';
import './styles.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Menu from '@mui/material/Menu';
import Drawer from '@mui/material/Drawer';
import GridViewIcon from '@mui/icons-material/GridView';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import WidgetsIcon from '@mui/icons-material/Widgets';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';

export default function Navigation() {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false); 

  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCustomers = () => {
    navigate('/customers')
  }

  const handleOrders = () => {
    navigate('/orders')
  }
  
  const handleProducts = () => {
    navigate('/products')
  }

  const handleTransactions = () => {
    navigate('/transactions')
  }

  const handleCategories = () => {
    navigate('/categories')
  }

  const handleCategoriesCustomer = () => {
    navigate('/customercategories')
  }

  const handleStats = () => {
    navigate('/stats')
  }

  const handleTasks = () => {
    navigate('/tasks')
  }

  const handleReports = () => {
    navigate('/reports')
  }

  const handleHome = () => {
    navigate('/')
  }

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setIsDrawerOpen(open);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Logo
          </Typography>
          {auth && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Minha conta</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        variant="persistent" 
        sx={{
          width: 300, 
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 300, 
          },
        }}
      >
        <div onClick={toggleDrawer(false)}>
          <MenuItem><i id='item_icons'><KeyboardBackspaceIcon /></i>Fechar</MenuItem>
          <MenuItem onClick={handleHome}><i id='item_icons'><GridViewIcon /></i>Página principal</MenuItem>
          <MenuItem onClick={handleCustomers}><i id='item_icons'><PersonIcon /></i>Clientes</MenuItem>
          <MenuItem onClick={handleOrders}><i id='item_icons'><ShoppingCartIcon /></i>Pedidos</MenuItem>
          <MenuItem onClick={handleProducts}><i id='item_icons'><WidgetsIcon /></i>Produtos</MenuItem>
          <MenuItem onClick={handleCategories}><i id='item_icons'><CategoryIcon /></i>Categoria de produtos</MenuItem>
          <MenuItem onClick={handleCategoriesCustomer}><i id='item_icons'><PeopleAltIcon /></i>Categoria de clientes</MenuItem>
          <MenuItem onClick={handleTransactions}><i id='item_icons'><MonetizationOnIcon /></i>Transações</MenuItem>
          <MenuItem onClick={handleTasks}><i id='item_icons'><EditCalendarIcon /></i>Atividades</MenuItem>
          <MenuItem onClick={handleStats}><i id='item_icons'><BarChartIcon /></i>Estatísticas gerais</MenuItem>
          <hr />
          <MenuItem onClick={handleReports}><i id='item_icons'><CalendarMonthIcon /></i>Relátorios 2023</MenuItem>
        </div>
      </Drawer>
    </Box> 
  );
}
