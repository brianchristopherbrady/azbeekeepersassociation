import React from 'react'
import Theme, { getComponentTheme } from './Theme'
import styled, { keyframes } from 'styled-components'
import range from 'ramda/src/range'
import PropTypes from 'prop-types'
import { CSSUnit, cssUnitRegex } from './PropTypes'

const getTheme = getComponentTheme('colors')

const Container = styled.div`
	position: absolute;
	background: radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%,rgba(0,0,0,0) 20%);
	width: 100%;
	height: 100%;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: center;
`

const Spin = styled.div`
	position: relative;
	width: ${({size}) => size};
	height: ${({size}) => size};
	perspective: 100px;
`

const zAnimation = keyframes`
	from {transform: translate3d(0,0,-20px);}
	to {transform: translate3d(0,0,20px);}
`

const DotContainer = styled.div`
	position: absolute;
	height: ${({height}) => height};
	width: ${({width}) => width};
	transform-origin: center;
	transform: translate3d(calc(${({height}) => height} / 2 - 50%), calc(${({height}) => height} / 2 - 50%), 0) rotateZ(${({rotate}) => rotate}deg);
	transform-style: preserve-3d;
`

const BobContainer = styled.div`
	/*animation: ${zAnimation} 2s cubic-bezier(0.445, 0.050, 0.550, 0.950) ${({delay}) => delay}s infinite alternate;*/
`

const fillAnimation = props => keyframes`
	0% {background-color: ${getTheme('primary')(props)};}
	50% {background-color: ${getTheme('secondary')(props)};}
	100% {background-color: ${getTheme('tertiary')(props)};}
`

const Dot = styled.div`
	width: ${({size}) => size};
	height: ${({size}) => size};
	background-color: ${getTheme('primary')};
	border-radius: 50%;
	animation: ${({animation}) => animation} ${({duration}) => duration}s cubic-bezier(0.445, 0.050, 0.550, 0.950) ${({delay, duration}) => delay * duration}s infinite alternate,	
		${props => fillAnimation(props)} ${({duration}) => duration * 2}s linear ${({delay, duration}) => delay * duration}s infinite alternate;
`

const Spinner = ({size, numberDots, duration}) => {
  const [_, sizeNumber, unit] = size.match(cssUnitRegex)
  const dotSize = `${sizeNumber / numberDots * 2}${unit}`
  const rotateInterval = 180 / numberDots
  const translateAnimation = keyframes`
		from {transform: translate3d(0, 0, 0);}
		to {transform: translate3d(0, calc(${size} - 100%), 0);}
	`

  return (
    <Container>
      <Spin size={size}>
        {range(0, numberDots).map(i => {
        	const delay = Math.PI * i / numberDots
          return (
            <BobContainer delay={delay} key={i}>
              <DotContainer width={dotSize} height={size} rotate={i * rotateInterval}>
                <Dot size={dotSize} delay={delay} animation={translateAnimation} duration={duration} />
              </DotContainer>
            </BobContainer>
          )
        })}
      </Spin>
    </Container>
  )
}

Spinner.propTypes = {
  size: CSSUnit.isRequired,
  duration: PropTypes.number.isRequired,
  numberDots: PropTypes.number.isRequired,
  themeName: PropTypes.string
}

Spinner.defaultProps = {
  size: '12rem',
  duration: 0.5,
  numberDots: 12,
  theme: Theme,
  themeName: ''
}

export default Spinner
