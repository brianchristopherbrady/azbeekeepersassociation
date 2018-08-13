import styled from 'styled-components'
import PropTypes from 'prop-types'
import Theme, { getComponentTheme } from '../Theme'

const getColors = getComponentTheme('colors')
const getBody = getComponentTheme('body')
const width = '32rem'

const Toolbar = styled.div`
	position: relative;
	width: 27.6rem;
	height: 100vh;
	padding: 2rem;
	transform: ${({show}) => show ? 'translate(4.4rem)' : `translateX(32rem)`};
	transition: transform 320ms ease-in-out;
	background-color: white;
	border-left: 1px solid ${getColors('tertiary')};
	pointer-events: auto;
	box-shadow: -2px 7px 19px -8px rgba(0,0,0,0.28);
	z-index: 10;
	font-size: ${getBody('fontSize')};
	font-family: ${getBody('fontFamily')};
`

Toolbar.propTypes = {
  show: PropTypes.bool.isRequired
}

Toolbar.defaultProps = {
  show: false
}

export default Toolbar
