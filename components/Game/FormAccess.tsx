import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material'
import Link from 'next/link'
import React from 'react'
import styles from 'styles/game/new.module.scss'

const FormAccess: React.FC = () => {
  return (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">
        Visibility & access
      </FormLabel>
      <p className={styles.sub}>
        Use Draft to review your page before making it public.{' '}
        <Link href="/docs/creators/access-control" target="blank">
          Learn more about access modes
        </Link>
      </p>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
      >
        <FormControlLabel
          value="disabled"
          control={<Radio />}
          label={
            <span>
              Draft
              <span className="sub">
                Only those who can edit the project can view the page
              </span>
            </span>
          }
        />
        <FormControlLabel
          value="restricted"
          control={<Radio />}
          label={
            <span>
              Restricted
              <span className="sub">
                {' '}
                — Only owners &amp; authorized people can view the page
              </span>
            </span>
          }
        />
        <FormControlLabel
          value="public"
          control={<Radio />}
          label={
            <span>
              Public
              <span className={styles.sub}>
                {' '}
                —{' '}
                <span>
                  Anyone can view the page
                  <span>
                    ,{' '}
                    <strong>{"you can enable this after you've saved"}</strong>
                  </span>
                </span>
              </span>
            </span>
          }
        ></FormControlLabel>
      </RadioGroup>
    </FormControl>
  )
}

export default FormAccess
