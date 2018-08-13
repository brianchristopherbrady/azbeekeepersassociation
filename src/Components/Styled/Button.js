import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Theme, { getComponentTheme } from './Theme'
import { CSSUnit } from './PropTypes'

const getTheme = getComponentTheme('button')

export const Button = styled.button`
  display: block;
  margin: ${getTheme('margin')};
  background-color: ${getTheme('backgroundColor')};
  border: ${getTheme('border')};
  min-width: ${props => props.width || getTheme('width')(props)};
  padding: 1rem;

  font-family: ${getTheme('fontFamily')};
  font-size: ${getTheme('fontSize')};
  color: ${getTheme('color')};
  text-transform: uppercase;
`

Button.propTypes = {
  width: CSSUnit,
  themeName: PropTypes.string
}

Button.defaultProps = {
  width: null,
  theme: Theme,
  themeName: ''
}

export default Button
