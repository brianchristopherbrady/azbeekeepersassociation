import styled from 'styled-components'
import Theme from './Theme'

const HR = styled.hr`
  border-color: ${({borderColor}) => borderColor};
  border-width: 0px;
  border-bottom-width: 1px;
  margin: 0 auto;
  margin-top: 1.2rem;
  margin-bottom: 1.2rem;
  width: ${({width}) => width};
`

HR.defaultProps = {
  ...Theme.hr,
  theme: Theme
}

export default HR
