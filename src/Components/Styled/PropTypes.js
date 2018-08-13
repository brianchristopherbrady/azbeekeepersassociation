import PropTypes from 'prop-types'

/***********************************
***** CSSUnit - useful for any css measurement
***********************************/
export const cssUnitRegex = /^(\d*.?\d+)(rem|em|ex|px|pt|pc|mm|cm|in|vh|vw|vmin|vmax|ch|%)?$/

const unit = isRequired => (props, propName, componentName) => {
  const val = props[propName]

  if (isRequired && val == null) {
    return new Error(`<${componentName}> requires a CSS unit value for its ${propName} property. Received ${typeof val}`)
  }
  if (val != null && !cssUnitRegex.test(val)) {
    return new Error(`<${componentName}> requires a valid CSS unit value for ${propName}. This means a number followed by one of: rem|em|ex|px|pt|pc|mm|cm|in|vh|vw|vmin|vmax|ch|%`)
  }
}

export const CSSUnit = unit(false)
CSSUnit.isRequired = unit(true)

/***********************************
***** Flex Types - useful for type checking flex properties
***********************************/
export const CSSFlexJustifyTypes = PropTypes.oneOf([
  'flex-start',
  'flex-end',
  'space-between',
  'space-around',
  'center'
])

export const CSSFlexAlignTypes = PropTypes.oneOf([
  'flex-start',
  'flex-end',
  'center',
  'stretch',
  'baseline'
])

export const HeaderPropTypes = {
  fontFamily: PropTypes.string,
  fontWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  letterSpacing: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fontSize: CSSUnit,
  color: PropTypes.string,
  textAlign: PropTypes.oneOf(['center', 'left', 'right']),
  textTransform: PropTypes.oneOf([
    'inherit',
    'initial',
    'unset',
    'capitalize',
    'uppercase',
    'lowercase',
    'none',
    'full-width'
  ]),
  lineHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  marginBottom: CSSUnit,
  marginTop: CSSUnit
}
