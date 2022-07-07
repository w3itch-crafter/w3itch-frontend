import { FormControl, FormLabel, MenuItem, Select } from '@mui/material'
import { classifications } from 'data'
import React from 'react'
import styles from 'styles/game/new.module.scss'

const FormClassification: React.FC = () => {
  return (
    <FormControl fullWidth>
      <FormLabel id="form-classification">Classification</FormLabel>
      <p className={styles.sub}>What are you uploading?</p>
      <Select id="form-classification" disabled defaultValue={classifications[0].value}>
        {classifications.map((classification) => (
          <MenuItem value={classification.value} key={classification.value}>
            {classification.label}
            {classification.description && (
              <span className="sub">
                {' — '}
                {classification.description}
              </span>
            )}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default FormClassification
