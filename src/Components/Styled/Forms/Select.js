import React from 'react'
import styled from 'styled-components'
import Theme, { getComponentTheme } from '../Theme'

/* ===== Inputs ============================================================ */
const getTheme = getComponentTheme('input')
const Select = styled.select`
  border: ${props => `1px solid ${getTheme('borderColor')(props)}`};
  width: ${getTheme('width')};
  padding: ${getTheme('padding')};
  height: ${getTheme('height')};
  margin: ${({theme}) => theme.input.margin};
  margin-top: ${({theme}) => theme.input.marginTop};
  margin-bottom: ${({theme}) => theme.input.marginBottom};
  font-size: ${getTheme('fontSize')};
  font-weight: ${getTheme('fontWeight')};
  color: ${getTheme('color')};
  text-align: ${getTheme('textAlign')};
  border-radius: ${getTheme('borderRadius')};
`

Select.defaultProps = {
  theme: Theme
}

export default Select
