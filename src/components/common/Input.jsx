function Input({ id, name, value, label, placeholder, error, className, handleChange, handleBlur }) {
  return (
    <div className={className}>
      <label htmlFor={name}>{label}</label>
      <input
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur} />
      {error.error && <div>{error.message}</div>}
    </div>
  )
}

export default Input;
