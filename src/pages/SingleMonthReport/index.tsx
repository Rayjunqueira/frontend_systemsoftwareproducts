import './styles.css';

type Props = {}

const SingleMonthReport = (props: Props) => {
  return (
    <div className="invoice">
        <header>
            <h1>Janeiro 2023</h1>
            <p>Data: 05/09/2023 ás 17:58</p>
        </header>
        <main>
            <section className="customer">
                <h2>Informações</h2>
                <p><strong>Total de pedidos:</strong> 46</p>
                <p><strong>Receita total:</strong> R$ 348.90</p>
                <p><strong>Custo total:</strong> R$ 34.90</p>
                <p><strong>Lucro bruto:</strong> R$ 304.90</p>
                <p><strong>Taxa de lucro:</strong> + 36%</p>
            </section>
        </main>
    </div>
  )
}

export default SingleMonthReport;