function SelectBox({ id, name, label, options, selectedOption, handleChange, className }) {
  return (
    <div className={className}>
      <label htmlFor={name}>{label}</label>
      <select id={id} name={name} value={selectedOption} onChange={handleChange}>
        {options.map(e => {
          return <option value={e.value} key={e.id}>{e.label}</option>
        })}
      </select>
    </div>
  )
}

export default SelectBox;
