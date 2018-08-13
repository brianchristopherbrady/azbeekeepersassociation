import React from 'react'
import styled from 'styled-components'
import Theme from './Theme'
import { NavLink as RouterNavLink } from 'react-router-dom'

const NavLink = styled(({theme, ...props}) => <RouterNavLink {...props} />)`
  display: block;
  text-decoration: none;
  color: ${({theme}) => theme.colors.white};
  font-family: ${({theme}) => theme.body.fontFamily};
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.4rem;
  text-transform: uppercase;
  text-align: center;
`

NavLink.defaultProps = {
  theme: Theme
}

export default NavLink
