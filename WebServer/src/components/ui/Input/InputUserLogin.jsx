

const InputUserLogin = ({ value, onChange, ...props }) => (
  <input
    type="text"
    placeholder="Usuario"
    value={value}
    onChange={onChange}
    autoComplete="username"
    {...props}
  />
);

export default InputUserLogin;
