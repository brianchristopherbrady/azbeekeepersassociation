// import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { P } from '../Typography'
import Theme, { getComponentTheme } from '../Theme'

/* ===== Errors ============================================================ */
const getTheme = getComponentTheme('error')
const InputError = P.extend`
  font-size: ${getTheme('fontSize')};
  font-weight: ${getTheme('fontWeight')};
  color: ${getTheme('color')};
  text-align: ${getTheme('textAlign')};
  margin-bottom: ${getTheme('marginBottom')};
  margin-top: ${getTheme('marginTop')};
  min-height: ${getTheme('minHeight')};
`

InputError.defaultProps = {
  theme: Theme
}

export default InputError
