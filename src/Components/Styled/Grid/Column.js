import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Theme from '../Theme'
import { CSSUnit, CSSFlexAlignTypes, CSSFlexJustifyTypes } from '../PropTypes'

/***********************************
***** Column
***********************************/
const Column = styled.div`
  display: block;
  flex: 1 1 ${props => props.width};
  margin-left: ${props => props.offset};
  max-width: ${props => props.width};
  width: 100%;
`

Column.defaultProps = {
  offset: '0px',
  width: '1',
  align: 'center',
  theme: Theme
}

Column.propTypes = {
  offset: CSSUnit.isRequired,
  width: CSSUnit.isRequired,
  align: CSSFlexAlignTypes.isRequired
}

export default Column
