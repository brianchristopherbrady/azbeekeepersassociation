import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Theme, { getComponentTheme } from './Theme'
import Button from './Button'
import { Link } from './Typography'

const getTheme = getComponentTheme('button')

const ButtonLink = Button.withComponent(Link).extend`
  text-align: center;
  width: ${props => props.width || getTheme(props).width};
`

ButtonLink.propTypes = {
  to: PropTypes.string.isRequired,
  width: PropTypes.string
}

ButtonLink.defaultProps = {
  width: null,
  theme: Theme,
  to: ''
}

export default ButtonLink
