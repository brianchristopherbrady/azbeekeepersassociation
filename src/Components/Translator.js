import React, { Component, PureComponent, createContext } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled, { keyframes } from 'styled-components'
import marked from 'marked'
import parseHtml from 'html-react-parser'
import domToReact from 'html-react-parser/lib/dom-to-react'
import { PageContext } from '../HOC/PageContainer'
import { Creators as PagesCreators, Selectors as PagesSelectors } from '../Store/pages'
import { getComponentTheme } from './Styled/Theme'
import * as Styled from './Styled'
import ErrorBoundary from './ErrorBoundary'

/* ========================= */
/* === Styled Components === */
/* ========================= */
const getColor = getComponentTheme('colors')

const Input = styled.textarea`
  border: 1px solid #A8D0FA;
  font-size: inherit;
  font-family: inherit;
  font-weight: inherit;
  color: inherit;
  text-transform: inherit;
  letter-spacing: inherit;
  box-shadow:  0px 0px 0px 0px rgba(96,149,206,0);
  transition: box-shadow 100ms linear;
  margin: 0;
  padding: 0.4rem;
  width: 100%;
  background-color: inherit;

  &:focus {
    outline: none;
    box-shadow:  0px 2px 10px 0px rgba(96,149,206,0.31);
  }
`

const LoadingKeyframes = keyframes`
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
`

const LoadingRect = styled.rect`
  animation: 1.6s infinite normal ${LoadingKeyframes};
  animation-timing-function: linear;
  fill: ${getColor('secondary')};
  stroke-width: 0;
`

const StyledLoader = styled.svg`
  width: 100%;
`

const Loader = () => (
  <StyledLoader height='33' width='100' viewBox='0 0 100 33' preserveAspectRatio='none'>
    <defs>
      <linearGradient id='gradient'>
        <stop offset='0' stopColor='white' stopOpacity='0.5' />
        <stop offset='0.5' stopColor='white' stopOpacity='0.8' />
        <stop offset='1' stopColor='white' stopOpacity='0.5' />
      </linearGradient>
      <mask id='mask'>
        <rect x='0' y='0' width='100' height='33' fill='url(#gradient)' />
      </mask>
    </defs>
    <LoadingRect x='0' y='0' height='33' width='100' mask='url(#mask)' />
  </StyledLoader>
)

/* ======================================== */
/* === Markdown Parser Helper Component === */
/* ======================================== */
const replaceNode = (node) => {
  if (node.type === 'text' || node.name == null) return node
  const upper = node.name.toUpperCase()
  const title = node.name.slice(0, 1).toUpperCase() + node.name.slice(1)
  let alt
  let props = {...node.attribs}
  switch (title) {
    case 'Img':
      alt = 'Image'
      break
    case 'A':
      const isExternal = props.href && !/^\//.test(props.href)
      alt = isExternal ? 'A' : 'Link'
      if (!isExternal) {
        props.to = props.href
      }
      break
    case 'Ul':
      alt = 'UnorderedList'
      break
    case 'Ol':
      alt = 'OrderedList'
      break
    case 'Li':
      alt = 'ListItem'
      break
    default:
      alt = node.name
  }
  const N = Styled[alt] || Styled[upper] || Styled[title]
  if (N == null) return domToReact(node, {replace: replaceNode})
  return node.children.length
    ? <N {...props}>{domToReact(node.children, {replace: replaceNode})}</N>
    : <N {...props} />
}

const Parser = ({component: C, content, ...props}) => {
  const P = parseHtml(content, {replace: replaceNode})
  return <C {...props}>{P}</C>
}

/* ================ */
/* === DUMB GUY === */
/* ================ */
class T extends PureComponent {
  static propTypes = {
    zone: PropTypes.string,
    component: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
      PropTypes.instanceOf(Component),
      PropTypes.instanceOf(PureComponent)
    ]),
    values: PropTypes.object,
    pageName: PropTypes.string.isRequired,
    inline: PropTypes.bool
  }

  static defaultProps = {
    inline: true
  }

  handleEdit = (e) => {
    const {dispatchEdit} = this.props
    const content = e.target.value || e.target.textContent
    dispatchEdit(content)
  }

  render () {
    const {zone, values, component: C, page, edits, pageName, isEditing, global, inline, ...props} = this.props
    const fallback = global.zones.find(z => z.id === zone) || {content: null}
    const z = (page && page.zones && page.zones.find(z => z.id === zone)) || fallback
    const fetching = z.content == null && (page.fetching || global.fetching)
    const mark = inline ? marked.inlineLexer : marked

    const hasContent = !isEditing && !!z.content
    const content = (z && z.content) || zone
    const lines = content.split('\n').length
    let displayContent = isEditing
      ? <Input rows={lines} value={!edits[zone] ? content : edits[zone]} onChange={this.handleEdit} />
      : (content && mark(content, {sanitize: true})) || zone

    if (fetching) {
      displayContent = <Loader />
    }

    return (
      <ErrorBoundary>
        {hasContent
          ? <Parser {...props} content={displayContent} component={C} />
          : <C {...props}>{displayContent}</C>
        }
      </ErrorBoundary>
    )
  }
}

/* =============== */
/* === CONNECT === */
/* =============== */
const mapStateToProps = (state, ownProps) => {
  const {pageName} = ownProps
  const page = PagesSelectors.getPage(state)(pageName)
  return {
    pageName,
    page,
    edits: page.edits,
    isEditing: state.pages.isEditing,
    global: state.pages,
    ...ownProps
  }
}

const mapDispatchToProps = (dispatch, {pageName, zone}) => bindActionCreators({
  dispatchEdit: PagesCreators.pageZonesEdit.bind(null, pageName, zone)
}, dispatch)

const Translator = connect(mapStateToProps, mapDispatchToProps)(T)

/* =================== */
/* === CONTEXT GUY === */
/* =================== */
const TranslatorProvider = (props) => {
  return (
    <PageContext.Consumer>
      {pageName => <Translator pageName={pageName} {...props} />}
    </PageContext.Consumer>
  )
}

export default TranslatorProvider
