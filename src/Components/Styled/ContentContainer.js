import styled from 'styled-components'
import PropTypes from 'prop-types'
import Theme from './Theme'
import { CSSUnit } from './PropTypes'

const ContentContainer = styled.div`
  position: relative;
  margin: 0 auto;
  padding: 0;
  width: ${props => props.width};
`

ContentContainer.propTypes = {
  width: CSSUnit.isRequired,
  theme: PropTypes.object.isRequired
}

ContentContainer.defaultProps = {
  width: Theme.content.width,
  theme: Theme
}

export default ContentContainer
