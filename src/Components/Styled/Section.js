import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Theme, { getComponentTheme } from './Theme'

const getTheme = getComponentTheme('section')

export const Section = styled.section`
  display: block;
  margin: ${getTheme('margin')};
  background-color: ${getTheme('backgroundColor')};
  border: ${getTheme('border')};
  min-width: ${props => props.width || getTheme('width')(props)};
  padding: 1rem;

  font-family: ${getTheme('fontFamily')};
  font-size: ${getTheme('fontSize')};
  color: ${getTheme('color')};
`

Section.propTypes = {
  themeName: PropTypes.string
}

Section.defaultProps = {
  theme: Theme,
  themeName: ''
}

export default Section
