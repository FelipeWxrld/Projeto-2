// Componente controlado: o valor vive no componente pai (props value/onChange)
function CurrencySelect({ id, label, value, onChange, currencies }) {
  const codes = Object.keys(currencies).sort()

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {codes.map((code) => (
          <option key={code} value={code}>
            {code} · {currencies[code]}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CurrencySelect
