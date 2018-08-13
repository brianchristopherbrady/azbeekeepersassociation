import React, { PureComponent } from 'react'
import { H3 } from './Styled'

export default class ErrorBoundary extends PureComponent {
	state = {
	  error: null
	}

	componentDidCatch (error, info) {
	  console.warn(error, info, this.props.children)
	  this.setState({error})
	}

	render () {
	  const {error} = this.state
	  if (error) return <H3>{error.message}</H3>
	  return this.props.children
	}
}
