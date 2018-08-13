import styled from 'styled-components'

const width = '32rem'

export default styled.div`
	position: fixed;
	pointer-events: none;
	width: ${width};
	right: 0;
	top: 0;
	height: 100vh;
	overflow: hidden;
	z-index: 100;
`
