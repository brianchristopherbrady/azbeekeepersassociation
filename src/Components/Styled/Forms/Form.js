import React from 'react'
import styled from 'styled-components'
import Theme from '../Theme'

/* ===== Field Container =================================================== */
const Form = styled.form`
  border: 0;
  margin: 0;
  margin-bottom: 0.8rem;
  padding: 0;
`

Form.propTypes = {
}

Form.defaultProps = {
  theme: Theme
}

export default Form
