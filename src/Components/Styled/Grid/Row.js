import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Theme from '../Theme'
import { CSSUnit, CSSFlexAlignTypes, CSSFlexJustifyTypes } from '../PropTypes'

const Row = styled(({wrap, align, justify, theme, ...rem}) => <div {...rem} />)`
  width: 100%;
  display: flex;
  align-items: ${props => props.align};
  justify-content: ${props => props.justify};
  flex-wrap: ${props => props.wrap ? 'wrap' : 'nowrap'};
  padding: 0;
`

Row.defaultProps = {
  wrap: false,
  align: 'stretch',
  justify: 'space-between',
  theme: Theme
}

Row.propTypes = {
  wrap: PropTypes.bool.isRequired,
  align: CSSFlexAlignTypes,
  justify: CSSFlexJustifyTypes
}

export default Row
