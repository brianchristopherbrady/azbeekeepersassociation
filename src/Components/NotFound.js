import React from 'react'
import { H1, H3, Container, ButtonLink } from './Styled'

export default (props) => (
  <Container>
    <H1>Page not found</H1>
    <H3>Where were you trying to go?</H3>
    <ButtonLink to='/'>Home</ButtonLink>
  </Container>
)
