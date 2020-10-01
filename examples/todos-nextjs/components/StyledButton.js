const StyledButton = ({ children, ...props }) => {
  return (
    <div className="flex items-center justify-between">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        {...props}
      >
        {children}
      </button>
    </div>
  )
}

export default StyledButton
