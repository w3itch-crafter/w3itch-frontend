import React, { Fragment } from 'react'

const FormGameName: React.FC = ({ children }) => {
  return (
    <Fragment>
      <div>
        Currently in update mode, please re-upload if you need to update the
        game.
      </div>
      <div>(Game name will not change)</div>
      <div>
        Game name:
        <span style={{ fontWeight: 'bold' }}>{children}</span>
      </div>
    </Fragment>
  )
}

export default FormGameName
