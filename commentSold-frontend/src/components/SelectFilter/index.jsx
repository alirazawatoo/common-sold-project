import { MenuItem, TextField } from '@mui/material'

import { thresholdOptions } from 'utils/constants/inventory'

import './styles.scss'

const SelectFilter = ({
  operator, quantity, onOperatorChange, onQuantityChange,
}) => (
  <fieldset className='threshold-filter' data-testid='select-filter'>
    <legend>Stock level</legend>
    <TextField
      select
      label='Comparison'
      value={operator}
      onChange={(event) => onOperatorChange(event.target.value)}
    >
      {thresholdOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
      ))}
    </TextField>
    <TextField
      label='Units'
      type='number'
      value={quantity}
      onChange={(event) => onQuantityChange(event.target.value)}
      slotProps={{ htmlInput: { min: 0, step: 1, inputMode: 'numeric' } }}
    />
  </fieldset>
)

export default SelectFilter
