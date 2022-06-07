import { FormControl, FormLabel, MenuItem, Select } from '@mui/material'
import { releaseStatus } from 'data'
import React from 'react'

const FormReleaseStatus: React.FC = () => {
  return (
    <FormControl fullWidth>
      <FormLabel id="form-releaseStatus">Release status</FormLabel>
      <Select id="form-releaseStatus" value={releaseStatus[0].value} disabled>
        {releaseStatus.map((i) => (
          <MenuItem value={i.value} key={i.value}>
            {i.label}
            {i.description && (
              <span className="sub">
                {' — '}
                {i.description}
              </span>
            )}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default FormReleaseStatus
