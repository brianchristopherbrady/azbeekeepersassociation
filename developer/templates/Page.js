import React, { Component } from 'react'
import { H2 } from '../Components/Styled'
import Translator from '../Components/Translator'
import Actions from '../Actions'

export default class Template extends Component {
  componentWillMount () {
    const {actions, flow} = this.props
    if (!actions || !flow) return
    actions.forEach(action => {
    	if (Actions[action] == null) {
    		console.error(`[flow] Action not found. Please add an action to /Actions/index.js called '${action}'`)
    		return
    	}
    	flow(action, this.props)
    })
  }

  render () {
    return (
      <div>
        <H2>Hello from Template page</H2>
        <Translator zone='header' component={H2} />
      </div>
    )
  }
}
