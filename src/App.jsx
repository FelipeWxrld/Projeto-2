import Header from './components/Header'
import Footer from './components/Footer'
import Card from './components/Card'

function App() {
  return (
    <div className="app">
      <Header
        title="Currency Exchange App"
        subtitle="Converta e analise moedas com dados atualizados"
      />
      <main className="content">
        <Card title="Conversor">
          <p className="muted">Em breve: formulário de conversão.</p>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

export default App
