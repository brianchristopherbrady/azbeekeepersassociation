import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Container, Row, Column, NavLink } from './Styled'
import { getComponentTheme } from './Styled/Theme'
import { Selectors as PagesSelectors } from '../Store/pages'

const getColor = getComponentTheme('colors')

const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  min-height: 5.6rem;
  font-size: 2.4rem;
  width: 100%;
  background-color: ${getColor('primary')};
  padding: 1.2rem;
  margin-bottom: 1.6rem;
`

const Nav = ({pages}) => {
  const sortedPages = pages.sort((a, b) => a.doc.sort - b.doc.sort)
  return (
    <NavContainer>
      <Container>
        <Row>
          {sortedPages.map((page, i) => (
            <Column key={i}>
              <NavLink to={page.doc.path}>{page.doc.id}</NavLink>
            </Column>
          ))}
        </Row>
      </Container>
    </NavContainer>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  pages: PagesSelectors.pages(state)
})

export default connect(mapStateToProps)(Nav)
