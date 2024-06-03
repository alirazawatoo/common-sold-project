import { Autocomplete, TextField } from '@mui/material'

// A labelled, searchable dropdown over a list of strings.
const Select = ({
  id, label, options = [], value, onChange, onBlur, error, helperText, name, loading = false,
}) => (
  <Autocomplete
    id={id}
    options={options}
    value={value || null}
    loading={loading}
    onChange={(event, selected) => onChange(selected || '')}
    onBlur={onBlur}
    renderInput={(params) => (
      <TextField
        {...params}
        name={name}
        label={label}
        error={Boolean(error)}
        helperText={helperText}
      />
    )}
  />
)

export default Select
