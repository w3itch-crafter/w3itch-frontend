import { FormControl, FormLabel, TextField } from '@mui/material'
import React from 'react'
import styles from 'styles/game/new.module.scss'

const FormCustomNoun: React.FC = () => {
  return (
    <FormControl fullWidth>
      <FormLabel id="form-customNoun">Custom noun</FormLabel>
      <p className={styles.sub}>
        You can change how itch.io refers to your project by providing a custom
        noun.
      </p>
      <p className={styles.sub}>
        {" Leave blank to default to: '"}
        <span className="user_classification_noun">mod</span>
        {"'"}.
      </p>
      <TextField id="form-customNoun" placeholder="Optional" disabled />
    </FormControl>
  )
}

export default FormCustomNoun
