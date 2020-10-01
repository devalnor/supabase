const StyledInput = ({ name, title, placeholder, id, value, ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
        {title}
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id={id || name}
        type="text"
        placeholder={placeholder || title}
        value={value || ''}
        {...props}
      />
    </div>
  )
}

export default StyledInput
