// import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Theme from '../Theme'

/* ===== Field Container =================================================== */
const Fieldset = styled.fieldset`
  display: flex;
  flex-direction: ${props => props.horizontal ? 'row' : 'column'};
  justify-content: center;
  align-items: flex-start;
  border: 0;
  margin: 0;
  margin-bottom: 0.8rem;
  margin-right: 1.6rem;
  padding: 0;
`

Fieldset.propTypes = {
  horizontal: PropTypes.bool
}

Fieldset.defaultProps = {
  horizontal: false
}

export default Fieldset
