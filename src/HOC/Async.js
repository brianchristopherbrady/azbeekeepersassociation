// props to acdlite
// find the gist here: https://gist.github.com/acdlite/a68433004f9d6b4cbc83b5cc3990c194
import React, { Component } from 'react'

export default (getComponent) =>
  class AsyncComponent extends Component {
    static Component = null;
    _unmounted = true;

    state = {
      Component: AsyncComponent.Component
    }

    componentDidMount () {
      this._mounted = true
      if (!this.state.Component) {
        getComponent().then(res => {
          const Component = res.default
          AsyncComponent.Component = Component
          if (!this._mounted) return
          this.setState({ Component })
        })
      }
    }

    componentWillUnmount () {
      this._mounted = false
    }

    render () {
      const { Component } = this.state
      return Component
        ? <Component {...this.props} />
        : null
    }
  }
