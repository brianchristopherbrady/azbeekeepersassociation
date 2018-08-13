import React from 'react'
import PropTypes from 'prop-types'
import Theme from '../Theme'

export const Arrow = ({direction, size, color, className}) => {
  const half = size / 2
  let rot
  switch (direction) {
    case 'up':
      rot = -90
      break
    case 'right':
      rot = -180
      break
    case 'down':
      rot = 90
      break
    default:
      rot = 0
  }

  return (
    <svg className={className} height={size} width={size} >
      <path
        d={`M ${half} 0 L 1 ${half} L ${half} ${size}`}
        fill='none'
        stroke={color}
        strokeWidth={2}
        style={{transformOrigin: `${half}px ${half}px`, transform: `rotate(${rot}deg)`}}
      />
    </svg>
  )
}

Arrow.propTypes = {
  direction: PropTypes.oneOf([
    'up',
    'down',
    'left',
    'right'
  ]),
  color: PropTypes.string.isRequired,
  size: PropTypes.number,
  className: PropTypes.string
}

Arrow.defaultProps = {
  className: '',
  direction: 'left',
  color: Theme.colors.primary,
  size: 16
}

export default Arrow
