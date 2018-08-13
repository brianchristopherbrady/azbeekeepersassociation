import React, { Component, Fragment } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider, PageContainer } from './HOC'
import { Creators as PageCreators } from './Store/pages'
import { Page, NewPage, Actions } from 'scamperly/admin'

import { Container, H1 } from './Components/Styled'
import Nav from './Components/Nav'
import Modal from './Components/Modal'
import Toolbar from './Components/Toolbar'

const history = createBrowserHistory()
const SiteContainer = Container.extend`
  min-height: 70vh;
`

export default function createApp ({store, persistor}) {
  return class App extends Component {
    state = {
      showNewPage: false
    }

    componentWillMount () {
      store.dispatch(PageCreators.globalZonesRequest())
    }

    handleCloseNewPageModal = (e) => {
      this.setState({showNewPage: false})
    }

    handleOpenNewPageModal = (e) => {
      this.setState({showNewPage: true})
    }

    render () {
      const {showNewPage} = this.state

      return (
        <Provider store={store}>
          {/* <PersistGate persistor={persistor}> */}
          <ThemeProvider>
            <Router history={history}>
              <Fragment>
                <Nav />
                <Toolbar openNewPageModal={this.handleOpenNewPageModal} />
                <SiteContainer>
                  <Switch>
                    <Route path='/' component={PageContainer} pageName='landing' exact />
                    {Page == null ? null : <Route path='/admin/pages/:pageName' component={Page} exact />}
                    {Actions == null ? null : <Route path='/admin/actions' component={Actions} exact />}
                    <Route path='/:pagePath' component={PageContainer} />
                  </Switch>
                </SiteContainer>

                {
                  NewPage == null
                    ? null
                    : (
                      <Modal close={this.handleCloseNewPageModal} open={this.handleOpenNewPageModal} show={showNewPage}>
                        <NewPage />
                      </Modal>
                    )
                }

              </Fragment>
            </Router>
          </ThemeProvider>
          {/* </PersistGate> */}
        </Provider>
      )
    }
  }
}
