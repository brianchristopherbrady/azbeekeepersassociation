import React, { Fragment, PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Control, Errors, actions } from 'react-redux-form'
import styled from 'styled-components'
import { Selectors as ActionSelectors } from '../Store/actions'
import { Creators as PageCreators, Selectors as PageSelectors } from '../Store/pages'
import { H2, H4, HR, Error, Form as F, Input, Label, Fieldset, Select, Button, Spinner, List, ListItem, P, Column, Row } from '../Components/Styled'
import * as Val from '../Services/Validators'

const Container = styled.div`
  min-width: 60rem;
`

const SelectedListItem = ListItem.extend`
  border: 1px solid ${({theme}) => theme.colors.primary};
`

const PageItem = P.extend`
  margin: 0;
`

const FORM_MODEL = 'forms.__newPage__'

class NewPage extends PureComponent {
  state = {

  }

  handleSubmit = (form) => {
    this.props.submitPage(form)
  }

  componentDidUpdate (prevProps, prevState) {
    const {page} = this.props
    if (prevProps.page.fetching && !page.fetching && page.error == null) {
      this.history.push(form.path)
    }
  }

  render () {
    const {availableActions, pageNames, pathNames, pages, page, form} = this.props
    const sortedPages = pages
      .map((p) => p.doc)
      .concat(form)
      .sort((pageA, pageB) => +pageA.sort - +pageB.sort)

    return (
      <Container>
        <H2>Create a new page</H2>
        <HR width='100%' />
        <Row>
          <Column width='70%'>
            <Form component={F} model={FORM_MODEL} onSubmit={this.handleSubmit}>
              <Fieldset>
                <Label>Page Name (must be unique)</Label>
                <Control.text component={Input} model='.id' required errors={{unique: Val.unique(pageNames)}} />
                <Errors component={Error} model='.id' />
              </Fieldset>

              <Fieldset>
                <Label>Route (path)</Label>
                <Control.text component={Input} model='.path' required errors={{unique: Val.unique(pathNames), pattern: Val.pattern(/^\//)}} />
                <Errors component={Error} model='.path' required />
              </Fieldset>

              <Fieldset>
                <Label>Actions</Label>
                <Control.select component={Select} model='.actions' multiple themeName='multiple'>
                  {/* <option value='' disabled>select actions</option> */}
                  {availableActions.map((action, i) => <option key={i} value={action.id}>{action.id}</option>)}
                </Control.select>
              </Fieldset>

              <Fieldset>
                <Label>Sort</Label>
                <Control.text type='number' component={Input} model='.sort' required />
                <Errors component={Error} model='.sort' required />
              </Fieldset>

              {page.error == null ? null : <Error>{page.error}</Error>}
              <Control.button model={FORM_MODEL} component={Button} width='100%'>save</Control.button>
            </Form>
          </Column>
          <Column width='30%'>
            <H4>Page Order</H4>
            <List>
              {sortedPages.map((p, i) => {
                const Comp = p.id === form.id ? SelectedListItem : ListItem
                return (
                  <Comp key={i}>
                    <PageItem themeName='secondary'>{p.id || 'NEW PAGE'} -- {p.sort}</PageItem>
                  </Comp>
                )
              })}
            </List>
          </Column>
        </Row>
        {page.fetching ? <Spinner /> : null}
      </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    pages: PageSelectors.pages(state),
    pageNames: PageSelectors.pages(state).map(page => page.doc.id),
    pathNames: PageSelectors.pages(state).map(page => page.doc.path),
    availableActions: ActionSelectors.available(state),
    page: PageSelectors.getPage(state)(ownProps.pageName),
    form: state.forms['__newPage__']
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  reset: actions.reset,
  submitPage: PageCreators.createPageRequest
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(NewPage)
