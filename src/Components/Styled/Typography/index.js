import React from 'react'
import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'
import Theme, { getComponentTheme } from '../Theme'
import { HeaderPropTypes } from '../PropTypes'

function createTypeTag (tagName) {
  const getTheme = getComponentTheme(tagName)
  const component = styled[tagName]`
    font-family: ${getTheme('fontFamily')};
    font-weight: ${getTheme('fontWeight')};
    letter-spacing: ${getTheme('letterSpacing')};
    font-size: ${getTheme('fontSize')};
    color: ${getTheme('color')};
    text-align: ${getTheme('textAlign')};
    text-transform: ${getTheme('textTransform')};
    line-height: ${getTheme('lineHeight')};
    margin-bottom: ${getTheme('marginBottom')};
    margin-top: ${getTheme('marginTop')};
  `
  component.propTypes = HeaderPropTypes
  component.defaultProps = {
    theme: Theme
  }

  return component
}

export const H1 = createTypeTag('h1')
export const H2 = createTypeTag('h2')
export const H3 = createTypeTag('h3')
export const H4 = createTypeTag('h4')
export const H5 = createTypeTag('h5')
export const H6 = createTypeTag('h6')
export const B = createTypeTag('b')
export const P = createTypeTag('p')
export const Small = createTypeTag('small')
export const Strong = createTypeTag('strong')
export const Em = createTypeTag('em')
export const Span = createTypeTag('span')
export const BR = createTypeTag('br')

export const A = styled.a`
  text-decoration: none;
  color: ${({theme}) => theme.colors.primary};
  font-family: inherit;
`

A.defaultProps = {
  theme: Theme,
  href: '#'
}

export const Link = styled(({theme, ...props}) => <RouterLink {...props} />)`
  text-decoration: none;
  color: ${({theme}) => theme.colors.primary};
  font-family: inherit;
`

Link.defaultProps = {
  theme: Theme
}
