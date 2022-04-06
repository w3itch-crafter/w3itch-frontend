import { FormControl, FormLabel, MenuItem, Select } from '@mui/material'
import { FC } from 'react'
import { UseFormRegister } from 'react-hook-form'
import { Charset } from 'types/enum'
import { Game } from 'utils/validator'

interface Props {
  register: UseFormRegister<Game>
}

const FormCharset: FC<Props> = ({ register }) => {
  return (
    <FormControl fullWidth>
      <FormLabel id="form-charset">Charset</FormLabel>
      <Select
        id="form-charset"
        defaultValue={Charset.DEFAULT}
        {...register('charset')}
      >
        {Object.values(Charset).map((charset) => (
          <MenuItem value={charset} key={charset}>
            {charset}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default FormCharset
