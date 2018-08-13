import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Control, Errors, actions as formActions } from 'react-redux-form'
import { PageContext } from '../HOC/PageContainer'
import { Selectors as PageSelectors } from '../Store/pages'
import { Creators as ActionCreators, Selectors as ActionSelectors } from '../Store/actions'
import { H1, H2, H3, HR, Form as F, Input, Fieldset, Error, Label, Select, Button, Section, Row, Column, Spinner } from '../Components/Styled'

const NEW_ACTION_KEY = '__newAction__'

const ActionFormContainer = F.extend`
  position: relative;
`

class ActionForm extends PureComponent {
  state = {
    error: null
  }

  reset = () => {
    const {action, reset, cancel} = this.props
    const model = `forms.actions.${action.id}`
    if (cancel) {
      cancel(model)
    }
    reset(model, action)
  }

  render () {
    const {action, nextActions, errorActions, cancel, onSubmit, fetching} = this.props
    const {error} = this.state
    const model = `forms.actions.${action.id}`
    return (
      <Form component={ActionFormContainer} model={model} onSubmit={onSubmit}>
        <Fieldset>
          <Label>Name (must be unique)</Label>
          <Control.text component={Input} model='.id' disabled={action.id !== NEW_ACTION_KEY} />
          <Errors component={Error} model='.id' />
        </Fieldset>

        <Fieldset>
          <Label>Next Action</Label>
          <Control.select component={Select} model='.next'>
            <option value={null} />
            {nextActions.map((action, i) => <option key={i} value={action.id}>{action.id}</option>)}
          </Control.select>
          <Errors component={Error} model='.next' />
        </Fieldset>

        <Fieldset>
          <Label>Action on Error</Label>
          <Control.select component={Select} model='.error'>
            <option value={null} />
            {errorActions.map((action, i) => <option key={i} value={action.id}>{action.id}</option>)}
          </Control.select>
          <Errors component={Error} model='.error' />
        </Fieldset>

        <Row>
          {error == null ? null : <Error>{error}</Error>}
          {
            cancel == null
              ? null
              : (
                <Column>
                  <Button width='100%' themeName='secondary' onClick={cancel}>cancel</Button>
                </Column>
              )
          }
          <Column>
            <Control.button model={model} component={Button} width='100%'>save</Control.button>
          </Column>
        </Row>
        {fetching ? <Spinner /> : null}
      </Form>
    )
  }
}

class Actions extends PureComponent {
  state = {
    addingNew: false
  }

  handleAddNew = () => {
    this.setState({addingNew: true})
  }

  renderAddNew () {
    return (
      <Section>
        <HR width='100%' />
        <Button onClick={this.handleAddNew} width='100%'>+</Button>
      </Section>
    )
  }

  handleCancelNew = () => {
    this.props.resetNew('forms.actions.__newAction__')
    this.setState({addingNew: false})
  }

  renderAddNewForm () {
    const {availableActions, resetExisting, fetching, submitAction} = this.props
    const action = {id: NEW_ACTION_KEY}
    return (
      <Section>
        <HR width='100%' />
        <H3>Add new action</H3>
        <ActionForm
          action={action}
          nextActions={[...availableActions]}
          errorActions={[...availableActions]}
          cancel={this.handleCancelNew}
          reset={resetExisting}
          fetching={fetching}
          onSubmit={submitAction}
        />
      </Section>
    )
  }

  render () {
    const {availableActions, forms, resetExisting, fetching, submitAction} = this.props
    const {addingNew} = this.state
    return (
      <div className='themes'>
        <H1>Actions</H1>
        {
          addingNew
            ? this.renderAddNewForm()
            : this.renderAddNew()
        }

        <Row wrap justify='flex-start'>
          {availableActions.map((action, i) => (
            <Column key={i} width='32rem'>
              <Section>
                <HR width='100%' />
                <H3>{action.id}</H3>
                <ActionForm action={action}
                  nextActions={availableActions.filter(a => a.id !== action.id)}
                  errorActions={[...availableActions]}
                  reset={resetExisting}
                  fetching={fetching}
                  onSubmit={submitAction}
                />
              </Section>
            </Column>
          ))}
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  availableActions: ActionSelectors.available(state),
  forms: state.forms.actions,
  fetching: state.actions.fetching
})

const mapDispatchToProps = dispatch => bindActionCreators({
  resetNew: formActions.reset,
  resetExisting: formActions.change,
  submitAction: ActionCreators.createActionRequest
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Actions)
