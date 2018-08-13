import React from 'react'
import styled from 'styled-components'
import Theme, { getComponentTheme } from '../Theme'

/* ===== Label ============================================================= */
const getTheme = getComponentTheme('label')

const Label = styled.label`
  font-family: ${getTheme('fontFamily')};
  font-size: ${getTheme('fontSize')};
  font-weight: ${getTheme('fontWeight')};
  color: ${getTheme('color')};
  text-align: ${getTheme('textAlign')};
`

Label.defaultProps = {
  theme: Theme
}

export default Label
