import styled from 'styled-components'
import PropTypes from 'prop-types'

const Image = styled.img`
  display: block;
`

Image.propTypes = {
  src: PropTypes.string.isRequired
}

export default Image
