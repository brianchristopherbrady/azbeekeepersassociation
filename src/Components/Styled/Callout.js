import React from 'react'
import styled from 'styled-components'

export default styled.div`
	padding: 1.6rem;
	border: 1px solid ${({theme}) => theme.colors.tertiary};
	border-radius: 0.8rem;
	background-color: ${({theme}) => theme.colors.white};
	box-shadow: ${({hide}) => hide ? '0px 0px 0px -10px rgba(0,0,0,0)' : '2px 28px 61px -10px rgba(0,0,0,0.47)'};
  transition: transform 520ms ease-in-out, box-shadow 220ms ease-in-out;
  transform: ${({hide}) => hide ? 'scale(0.8)' : 'scale(1)'};
`
