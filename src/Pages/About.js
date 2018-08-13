import React, { Component } from 'react'
import { H2, Section } from '../Components/Styled'
import Translator from '../Components/Translator'
import Actions from '../Actions'

export default class About extends Component {
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
        <Translator zone='header' component={H2} />
        <Translator zone='body' component={Section} inline={false} />
      </div>
    )
  }
}
