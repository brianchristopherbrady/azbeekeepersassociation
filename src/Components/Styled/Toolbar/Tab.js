import styled from 'styled-components'
import Theme, { getComponentTheme } from '../Theme'

const getColors = getComponentTheme('colors')

export default styled.div`
	position: absolute;
	top: 26%;
	left: 0;
	transform-origin: bottom left;
	transform: rotate(-90deg);
	width: 20rem;
	height: 4.4rem;
	padding: 0.8rem;
	background-color: white;
	border-radius: 1.6rem 1.6rem 0 0;
	border-top: 1px solid ${getColors('tertiary')};
	border-left: 1px solid ${getColors('tertiary')};
	border-right: 1px solid ${getColors('tertiary')};
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: -21px 12px 29px -22px rgba(0,0,0,0.28);
	z-index: 1;
`
