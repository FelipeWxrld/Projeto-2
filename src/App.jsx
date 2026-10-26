import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Card from './components/Card'
import ConversionForm from './components/ConversionForm'
import ConversionResult from './components/ConversionResult'
import { Loading, ErrorMessage } from './components/Feedback'
import { useCurrencies } from './hooks/useCurrencies'
import { useConversion } from './hooks/useConversion'

function App() {
  // Estado compartilhado (Lifting State Up): vive no ancestral comum
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('BRL')

  const { currencies, loading, error } = useCurrencies()
  const conversion = useConversion({ from, to })

  function handleSwap() {
    setFrom(to)
    setTo(from)
  }

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
            <>
              <ConversionForm
                amount={amount}
                from={from}
                to={to}
                currencies={currencies}
                onAmountChange={setAmount}
                onFromChange={setFrom}
                onToChange={setTo}
                onSwap={handleSwap}
              />
              <ConversionResult
                amount={amount}
                from={from}
                to={to}
                rate={conversion.rate}
                date={conversion.date}
                loading={conversion.loading}
                error={conversion.error}
                onRetry={conversion.refetch}
              />
            </>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  )
}

export default App
