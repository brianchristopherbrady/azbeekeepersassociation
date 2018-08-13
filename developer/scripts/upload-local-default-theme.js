import { uploadLocalTheme } from '../Services'
import Theme from '../../src/Components/Styled/Theme'

uploadLocalTheme('default', Theme)
  .then(res => process.exit())
