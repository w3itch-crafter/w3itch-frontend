import { FormControl, FormLabel, MenuItem, Select } from '@mui/material'
import { FC } from 'react'
import { UseFormRegister } from 'react-hook-form'
import { GameFileCharset } from 'types/enum'
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
        defaultValue={GameFileCharset.UTF8}
        {...register('charset')}
      >
        {Object.values(GameFileCharset).map((charset) => (
          <MenuItem value={charset} key={charset}>
            {charset}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default FormCharset
