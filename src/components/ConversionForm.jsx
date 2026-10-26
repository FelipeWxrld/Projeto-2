import CurrencySelect from './CurrencySelect'

/**
 * Formulário "burro": não guarda estado.
 * Todo o estado (amount, from, to) foi elevado para o App (Lifting State Up),
 * pois o resultado, o gráfico e a tabela também dependem dele.
 */
function ConversionForm({ amount, from, to, currencies, onAmountChange, onFromChange, onToChange, onSwap }) {
  return (
    <form className="conversion-form" onSubmit={(e) => e.preventDefault()}>
      <div className="field">
        <label htmlFor="amount">Valor</label>
        <input
          id="amount"
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
        />
      </div>

      <CurrencySelect
        id="from"
        label="De"
        value={from}
        onChange={onFromChange}
        currencies={currencies}
      />

      <button
        type="button"
        className="btn btn-ghost swap"
        onClick={onSwap}
        aria-label="Inverter moedas"
        title="Inverter moedas"
      >
        ⇄
      </button>

      <CurrencySelect
        id="to"
        label="Para"
        value={to}
        onChange={onToChange}
        currencies={currencies}
      />
    </form>
  )
}

export default ConversionForm
