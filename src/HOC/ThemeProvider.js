import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { Theme } from '../Components/Styled'
import { Selectors } from '../Store/themes'
import api from '../Services/API'

class CustomThemeProvider extends Component {
	static propTypes = {
	  theme: PropTypes.object.isRequired
	}

	static defaultProps = {
	  theme: Theme
	}

	render () {
	  const {theme, children} = this.props
	  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
	}
}

const mapStateToProps = (state) => ({
  theme: Selectors.theme(state)
})

export default connect(mapStateToProps)(CustomThemeProvider)
