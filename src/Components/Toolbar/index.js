import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Types as PagesTypes, Creators as PagesCreators, Selectors as PagesSelectors } from '../../Store/pages'
import { Selectors as AuthSelectors } from '../../Store/auth'
import * as AdminComponents from 'scamperly/admin'
import { H3, ToolbarContainer, Toolbar, Tab, P, Row, Column, Button as B, Link, List, ListItem } from '../Styled'

const Button = B.extend`
  min-width: 0;
`

class Tools extends PureComponent {
  state = {
    show: false
  }

  toggleOpen = () => {
    this.setState({show: !this.state.show})
  }

  saveChanges = () => {
    const {pages, updateZonesForPage, disableEditing} = this.props
    pages.forEach((page) => updateZonesForPage(page.doc.id))
    disableEditing()
  }

  render () {
    const {isEditing, enableEditing, disableEditing, openNewPageModal, pages, isAdminOrSuper} = this.props
    if (!isAdminOrSuper) return null

    const {show} = this.state
    const pageItems = pages.map((page, i) => {
      return (
        <ListItem key={i}>
          <Link to={`/admin/pages/${page.doc.id}`}>{page.doc.id}</Link>
        </ListItem>
      )
    })
    return (
      <ToolbarContainer>
        <Toolbar show={show}>
          <Tab onClick={this.toggleOpen}><P>Open Tools</P></Tab>
          <Row>
            <Column>
              {
                isEditing
                  ? <Button onClick={disableEditing}>cancel</Button>
                  : <Button onClick={enableEditing}>edit</Button>
              }
            </Column>
            <Column>
              {isEditing && <Button onClick={this.saveChanges}>save</Button>}
            </Column>
          </Row>

          <Row>
            <Column>
              <H3>Edit actions</H3>
              <List>
                <ListItem>
                  <Link to='/admin/actions'>Actions</Link>
                </ListItem>
              </List>
            </Column>
          </Row>

          <Row>
            <Column>
              <H3>Edit pages</H3>
              <List>
                {pageItems}
                <ListItem>
                  <Link to='#' onClick={openNewPageModal}>+ New Page</Link>
                </ListItem>
              </List>
            </Column>
          </Row>

        </Toolbar>
      </ToolbarContainer>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    pages: PagesSelectors.pages(state),
    isEditing: state.pages.isEditing,
    isAdminOrSuper: AuthSelectors.hasRole(state)('uber', 'admin', 'superuser')
  }
}

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators({
  enableEditing: PagesCreators.pageEnableEditing,
  disableEditing: PagesCreators.pageDisableEditing,
  updateZonesForPage: PagesCreators.pageZonesUpdateRequest
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Tools)
