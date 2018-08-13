import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Control, Errors, actions as formActions } from 'react-redux-form'
import { PageContext } from '../HOC/PageContainer'
import { Selectors as PageSelectors, Creators as PageCreators } from '../Store/pages'
import { Selectors as ActionSelectors } from '../Store/actions'
import api from '../Services/API'
import { H1, H4, P, Form as F, Input, Fieldset, Error, Label, Select, Button, Spinner, Row, Column, List, ListItem } from '../Components/Styled'
import NotFound from '../Components/NotFound'
import * as Val from '../Services/Validators'

const SelectedListItem = ListItem.extend`
  border: 1px solid ${({theme}) => theme.colors.primary};
`

const PageItem = P.extend`
  margin: 0;
`

class DumbPage extends PureComponent {
  componentWillMount () {
    const {pageName, page, refresh, match, location} = this.props
    if (Object.keys(page).length === 0) return
    const model = `forms.${pageName}`
    refresh(model, page.doc)
  }

  handleSubmit = (form) => {
    const {pageName, submitPage} = this.props
    submitPage(pageName, form)
  }

  render () {
    const {pageName, pathNames, availableActions, fetching, error, page, pages, form} = this.props
    const sortedPages = pages
      .map((p) => form.id === p.doc.id ? form : p.doc)
      .sort((pageA, pageB) => +pageA.sort - +pageB.sort)

    if (Object.keys(page).length === 0) return <NotFound />

    return (
      <div className='page'>
        <H1>{pageName}</H1>
        <Row>
          <Column width='70%'>
            <Form component={F} model={`forms.${pageName}`} onSubmit={this.handleSubmit}>
              <Fieldset>
                <Label>Name (must be unique)</Label>
                <Control.text component={Input} model='.id' disabled />
                <Errors component={Error} model='.id' />
              </Fieldset>

              <Fieldset>
                <Label>Route (path)</Label>
                <Control.text component={Input} model='.path' errors={{unique: Val.unique(pathNames), pattern: Val.pattern(/^\//)}} />
                <Errors component={Error} model='.path' />
              </Fieldset>

              <Fieldset>
                <Label>Actions</Label>
                <Control.select component={Select} model='.actions' multiple themeName='multiple'>
                  {/* <option value='' disabled>select actions</option> */}
                  {availableActions.map((action, i) => <option key={i} value={action.id}>{action.id}</option>)}
                </Control.select>
                <Errors component={Error} model='.actions' />
              </Fieldset>

              <Fieldset>
                <Label>Sort</Label>
                <Control.text type='number' component={Input} model='.sort' required />
                <Errors component={Error} model='.sort' required />
              </Fieldset>

              {error == null ? null : <Error>{error}</Error>}
              <Control.button model={`.${pageName}`} component={Button} width='100%'>save</Control.button>
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
        {fetching ? <Spinner /> : null}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const pageName = ownProps.match.params.pageName
  return {
    ...ownProps,
    pageName,
    pathNames: PageSelectors.pages(state).filter(p => p.doc.id !== pageName).map(page => page.doc.path),
    availableActions: ActionSelectors.available(state),
    pages: PageSelectors.pages(state),
    page: PageSelectors.getPage(state)(pageName),
    fetching: state.pages.fetching,
    error: state.pages.error,
    form: state.forms[pageName]
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  reset: formActions.reset,
  refresh: formActions.change,
  submitPage: PageCreators.updatePageRequest
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DumbPage)
