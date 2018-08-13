import React from 'react'
import styled from 'styled-components'
import Theme, { getComponentTheme } from '../Theme'

/* ===== Inputs ============================================================ */
const getTheme = getComponentTheme('input')
const Input = styled.input`
  border: ${props => `1px solid ${getTheme('borderColor')(props)}`};
  width: ${getTheme('width')};
  padding: ${getTheme('padding')};
  margin: ${getTheme('margin')};
  margin-top: ${getTheme('marginTop')};
  margin-bottom: ${getTheme('marginBottom')};
  font-size: ${getTheme('fontSize')};
  font-weight: ${getTheme('fontWeight')};
  color: ${props => props.disabled ? props.theme.colors.fonts.tertiary : getTheme('color')(props)};
  text-align: ${getTheme('textAlign')};
  border-radius: ${getTheme('borderRadius')};
`

Input.defaultProps = {
  theme: Theme
}

export default Input
