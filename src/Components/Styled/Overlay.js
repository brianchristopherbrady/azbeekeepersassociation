import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Overlay = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	height: 100vh;
	width: 100%;
	display: flex;
	visibility: ${({hide}) => hide ? 'hidden' : 'visible'};
	opacity: ${({hide}) => hide ? 0 : 1};
	pointer-events: ${({hide}) => hide ? 'none' : 'initial'};
	align-items: center;
	justify-content: center;
	background: ${({theme}) => theme.overlay.background};
	transition: ${({hide}) => hide ? 'opacity 400ms linear, visibility 0ms linear 400ms' : 'opacity 400ms linear 1ms, visibility 0ms linear'};
`

Overlay.propTypes = {
  show: PropTypes.bool.isRequired
}

Overlay.defaultProps = {
  show: false
}

export default Overlay
