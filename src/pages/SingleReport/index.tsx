import React from 'react';
import './styles.css';

const SingleReport = () => {
  // Lista fictícia de produtos vendidos como exemplo
  const soldProducts = [
    { id: 1, productName: 'Produto A', totalSold: 50, totalRevenue: 1000 },
    { id: 2, productName: 'Produto B', totalSold: 30, totalRevenue: 600 },
    { id: 3, productName: 'Produto C', totalSold: 20, totalRevenue: 400 },
  ];

  return (
    <div className="add-order-container">
      <div className="square">
        <div className="title-report">
          <h3>Julho 2023</h3>
        </div>
        <div>
          <p>
            Ás <i>14:45</i> de <i>28/07/2023</i>
          </p>
          <hr />
        </div>
        <div className="info-container">
          <h3>Valores</h3>
          <div className="info">
            <h5>Receita total:</h5>
            <h5 id="positive">+ R$ 1898.90</h5>
          </div>
          <div className="info">
            <h5>Custo total:</h5>
            <h5 id="negative">- R$ 898.90</h5>
          </div>
          <div className="info">
            <h5>Lucro bruto:</h5>
            <h5 id="positive">+ R$ 1000.00</h5>
          </div>
          <div className="info">
            <h5>Lucro comparado a Junho:</h5>
            <h5 id="positive">+ R$ 30.00</h5>
          </div>
          <div className="info">
            <h5>Percentual comparado a Junho:</h5>
            <h5 id="positive">+ 15%</h5>
          </div>
          <hr />
          <h3>Pedidos</h3>
          <div className="info">
            <h5>Pedidos totais:</h5>
            <h5>108</h5>
          </div>
          <div className="info">
            <h5>Pedidos totais comparado a Junho:</h5>
            <h5 id="positive">+8</h5>
          </div>
          <hr />
          <h3>Produtos  mais vendidos de Julho</h3>
          <table>
            <thead>
              <tr>
                <th>Nome do Pedido</th>
                <th>Total Vendido</th>
                <th>Total de Receita</th>
              </tr>
            </thead>
            <tbody>
              {soldProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.productName}</td>
                  <td>{product.totalSold}</td>
                  <td id='positive'>R$ {product.totalRevenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Botão "Finalizar pedido" */}
      </div>
    </div>
  );
};

export default SingleReport;
