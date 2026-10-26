import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Card from './components/Card'
import CurrencySelect from './components/CurrencySelect'
import { Loading, ErrorMessage } from './components/Feedback'
import { useCurrencies } from './hooks/useCurrencies'

function App() {
  const { currencies, loading, error } = useCurrencies()
  const [from, setFrom] = useState('USD')

  return (
    <div className="app">
      <Header
        title="Currency Exchange App"
        subtitle="Converta e analise moedas com dados atualizados"
      />
      <main className="content">
        <Card title="Conversor">
          {loading && <Loading text="Carregando moedas..." />}
          {error && <ErrorMessage message={error} />}
          {!loading && !error && (
            <CurrencySelect
              id="from"
              label="Moeda de origem"
              value={from}
              onChange={setFrom}
              currencies={currencies}
            />
          )}
        </Card>
      </main>
      <Footer />
    </div>
  )
}

export default App
