import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Theme from '../Theme'
import { CSSUnit } from '../PropTypes'

/***********************************
***** Container (now with padding!)
***********************************/
const Container = styled.div`
  margin: 0 auto;
  max-width: ${props => props.maxWidth};
  min-width: ${props => props.minWidth};
  padding: 0 2.0rem;
  position: relative;
  width: 100%;
`
Container.propTypes = {
  maxWidth: CSSUnit.isRequired,
  minWidth: CSSUnit.isRequired
}

Container.defaultProps = {
  maxWidth: '112rem',
  minWidth: '30rem',
  theme: Theme
}

export default Container
