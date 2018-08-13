import React, { PureComponent, Component, createContext } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Selectors as PageSelectors } from '../Store/pages'
import { Creators as ActionCreators } from '../Store/actions'
import NotFound from '../Components/NotFound'
import * as Pages from '../Pages'

export const PageContext = createContext('global')

class PageContainer extends Component {
  static propTypes = {
    pageName: PropTypes.string
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.page == null) return false
    return this.props.location.pathname !== nextProps.location.pathname ||
      this.props.page.doc.id !== nextProps.page.doc.id ||
      nextProps.actions.length !== this.props.actions.length ||
      nextProps.actions.some(action => !this.props.actions.includes(action))
  }

  render () {
    const {pageName, page, AsyncComponent} = this.props
    if (page == null || AsyncComponent == null) return <NotFound />

    return (
      <PageContext.Provider value={pageName}>
        <AsyncComponent {...this.props} />
      </PageContext.Provider>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const {path, isExact} = ownProps.match
  const {pagePath} = ownProps.match.params
  const page = path === '/' && isExact
    ? PageSelectors.pages(state).find(p => p.doc.path === path)
    : PageSelectors.pages(state).find(p => p.doc.path === `/${pagePath}`)
  const pageName = (page && page.doc.id) || null
  const AsyncComponent = page ? Pages[page.doc.component] : null
  return {
    ...ownProps,
    page,
    pageName,
    AsyncComponent,
    actions: (page && page.doc && page.doc.actions) || []
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  flow: ActionCreators.flow
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PageContainer)
