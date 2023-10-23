import React, { useContext, useEffect, useState } from 'react';
import Select, { ActionMeta, MultiValue } from 'react-select';
import './styles.css';
import { useApi } from '../../hooks/useApi';
import { AuthContext } from '../../contexts/AuthContext';
import { UUID } from 'crypto';

type Customer = {
  customer_id: UUID;
  name: string;
};

type Product = {
  product_id: UUID;
  name: string;
  price: number;
  stock: number; // Adicionamos o campo de estoque para cada produto
};

const AddOrder = () => {
  const api = useApi();
  const { token } = useContext(AuthContext);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState<string>("");
  const [productId, setProductId] = useState<string>("");
  const [stockProduct, setStockProduct] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<MultiValue<{ value: UUID; label: string }>>([]);
  const [stock, setStock] = useState<{ [productId: string]: number }>({});
  const [selectedClient, setSelectedClient] = useState<{ value: UUID; label: string } | null>(null);
  const [discountValue, setDiscountValue] = useState<number | null>(null);
  const [selectedSales, setSelectedSales] = useState<UUID[]>([]);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const getCustomers = async (token: string | null) => {
      try {
        if (token?.includes) {
          const customerList = await api.getAllCustomers(token);
          setCustomers(customerList);
          setCustomerId(customerList.customer_id);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getCustomers(token);
  }, [token]);

  useEffect(() => {
    const getProducts = async (token: string | null) => {
      try {
        if (token?.includes) {
          const productList = await api.getAllProducts(token);
          setProducts(productList);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getProducts(token);
  }, [token]);

  const customerOptions = customers.map((customer) => ({
    value: customer.customer_id,
    label: customer.name,
  }));

  const productOptions = products.map((product) => ({
    value: product.product_id,
    label: product.name,
  }));

  const handleClientChange = (selectedOption: { value: UUID; label: string } | null) => {
    setSelectedClient(selectedOption);
  };

  const handleProductsChange = (
    newValue: MultiValue<{ value: UUID; label: string }>,
    actionMeta: ActionMeta<{ value: UUID; label: string }>
  ) => {
    setSelectedProducts(newValue);

    const selectedSaleIds = newValue.map((product) => product.value);
    setSelectedSales(selectedSaleIds);
  };

  const handleStockChange = (productId: UUID, newStock: number) => {
    setStock({ ...stock, [productId]: newStock });
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDiscount = parseFloat(e.target.value) || 0;
    setDiscountValue(newDiscount);
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    selectedProducts.forEach((product) => {
      const productId = product.value;
      const productInfo = products.find((p) => p.product_id === productId);
      if (productInfo !== undefined) {
        const price = productInfo.price;
        const productStock = stock[productId] || 0;
        totalPrice += price * productStock;
      }
    });
    return totalPrice;
  };

  const calculateTotalPriceWithDiscount = () => {
    const totalPrice = calculateTotalPrice();
    return totalPrice - (discountValue || 0);
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      width: '300px',
    }),
  };

  const handleSaveOrder = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (selectedClient && selectedSales.length > 0 && token) {
      let stockError = false;

      // Verifique o estoque para cada produto selecionado
      for (const productValue of selectedProducts) {
        const productId = productValue.value;
        const productInfo = products.find((p) => p.product_id === productId);
        if (productInfo !== undefined) {
          const productStock = stock[productId] || 0;
          if (productStock < 0) {
            stockError = true;
            break;
          }
          if (productStock > productInfo.stock) {
            stockError = true;
            break;
          }
        }
      }

      if (stockError) {
        setErrorMessage("Não há estoque suficiente para um ou mais produtos.");
      } else {
        // Se o estoque for suficiente, continue com a criação do pedido
        try {
          const createdSales = await Promise.all(
            selectedSales.map((sale_id) =>
              api.createSale(selectedClient.value, sale_id, stock[sale_id] || 0, token)
            )
          );

          const saleIds = createdSales.map((sale) => sale.data.sale_id);

          const orderData: any = {
            customer: {
              customer_id: selectedClient.value,
            },
            sales: saleIds.map((sale_id) => ({ sale_id })),
          };

          if (discountValue !== null) {
            orderData.discount = discountValue;
          }

          const response = await api.createOrder(orderData, token);

          if (response.success) {
            setIsCreate(true);
          } else {
            setErrorMessage("Aconteceu um erro.");
            console.log(response.error);
          }
        } catch (err) {
          setErrorMessage("Aconteceu um erro.");
          console.error(err);
        }
      }
    } else {
      console.error("Cliente, vendas ou token não estão disponíveis.");
    }
  };

  return (
    <form className="order-form">
      <label htmlFor="orderName">Buscar cliente por ID ou nome:</label>
      <Select
        options={customerOptions}
        value={selectedClient}
        onChange={handleClientChange}
        placeholder="Buscar cliente..."
        isClearable={true}
        styles={customStyles}
      />

      <label htmlFor="productName">Buscar produto(s) por ID ou nome:</label>
      <Select
        options={productOptions}
        value={selectedProducts}
        onChange={handleProductsChange}
        placeholder="Buscar produto..."
        isMulti
        isClearable={true}
        styles={customStyles}
      />

      {selectedProducts && selectedProducts.length > 0 && (
        <div>
          <label id="quantityLabel">Quantidades e Preços:</label>
          {selectedProducts.map((product) => (
            <div key={product.value}>
              <input
                type="number"
                placeholder="Quantidade"
                onChange={(e) => {
                  const newStock = parseInt(e.target.value, 10) || 0;
                  handleStockChange(product.value, newStock);
                }}
              />
              <span id="unitprice">Preço unitário: R${(products.find((p) => p.product_id === product.value)?.price || 0)}</span>
              <span id="stock">Estoque disponível: {products.find((p) => p.product_id === product.value)?.stock || 0}</span>
            </div>
          ))}
        </div>
      )}

      <div id="discount-div">
        <label htmlFor="discount">Desconto (R$):</label>
        <input
          id="discount-input"
          type="number"
          placeholder="Desconto"
          value={discountValue === null ? '' : discountValue.toString()}
          onChange={handleDiscountChange}
          onFocus={() => setDiscountValue(null)}
        />
      </div>

      <div className="totalPrice">
        <span>Total com Desconto: R${calculateTotalPriceWithDiscount().toFixed(2)}</span>
      </div>

      <button type="submit" onClick={handleSaveOrder}>
        Cadastrar Pedido
      </button>
      {isCreate ? (
        <p>Pedido criado!</p>
      ) : <p className="error-message">{errorMessage}</p>}
    </form>
  );
};

export default AddOrder;
