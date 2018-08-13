import Color from 'color'

/* ========================================================
   Main Colors
   ===================================================== */
export const palette = {
  white: Color('#FFFFFF'),
  red: Color('#f44336'),
  pink: Color('#E91E63'),
  purple: Color('#9C27B0'),
  deepPurple: Color('#673AB7'),
  indigo: Color('#3F51B5'),
  blue: Color('#2196F3'),
  lightBlue: Color('#03A9F4'),
  cyan: Color('#00BCD4'),
  teal: Color('#009688'),
  green: Color('#4CAF50'),
  lightGreen: Color('#8BC34A'),
  lime: Color('#CDDC39'),
  yellow: Color('#FFEB3B'),
  amber: Color('#FFC107'),
  orange: Color('#FF9800'),
  deepOrange: Color('#FF5722'),
  brown: Color('#795548'),
  grey: Color('#9E9E9E'),
  blueGrey: Color('#607D8B')
}

const colorStrings = Object.keys(palette)
  .reduce((memo, colorName) => {
    memo[colorName] = palette[colorName].toString()
    return memo
  }, {})

export const colors = {
  ...colorStrings,
  primary: colorStrings.blue,
  secondary: palette.purple.lighten(0.1).toString(),
  tertiary: palette.deepPurple.darken(0.2).toString(),
  error: 'rgba(255, 102, 0, 0.95)',
  fonts: {
    primary: palette.blueGrey.darken(0.5).toString(),
    secondary: palette.grey.darken(0.4).toString(),
    tertiary: palette.grey.darken(0.1).toString()
  }
}

/* ========================================================
   Header & Body Defaults / Fallback
   ===================================================== */
export const header = {
  fontFamily: 'Roboto-Bold, Roboto Bold, Roboto, ArialMT, Arial, sans-serif',
  fontWeight: '400',
  letterSpacing: 'normal',
  color: colors.fonts.primary,
  textAlign: 'left',
  textTransform: 'none',
  lineHeight: '1.2',
  marginBottom: '1.8rem',
  marginTop: '0',
  secondary: {
    color: colors.fonts.secondary
  },
  tertiary: {
    color: colors.fonts.tertiary
  }
}

export const body = {
  fontFamily: 'Roboto-Regular, Roboto, ArialMT, Arial, sans-serif',
  fontWeight: '400',
  fontSize: '1.3rem',
  color: colors.fonts.primary,
  lineHeight: 'normal',
  textTransform: 'inherit'
}

/* ========================================================
   App Theme
   ===================================================== */
export default {
  /* Headers Themes must have these properties
    fontFamily
    fontSize
    fontWeight
    letterSpacing
    color
  */
  colors,
  header,
  content: {
    width: '96rem'
  },

  h1: {
    ...header,
    fontSize: '4.6rem',
    letterSpacing: '-0.1rem',
    textTransform: 'uppercase',
    lineHeight: '4.4rem'
  },
  h2: {
    ...header,
    fontSize: '3.6rem',
    letterSpacing: '-0.1rem',
    textTransform: 'uppercase',
    lineHeight: '4.4rem'
  },
  h3: {
    ...header,
    fontSize: '2.8rem',
    lineHeight: '2.8rem',
    letterSpacing: '-0.1rem',
    textTransform: 'uppercase',
    marginBottom: '1rem'
  },
  h4: {
    ...header,
    fontSize: '2.2rem',
    letterSpacing: '-0.08rem',
    lineHeight: '2.8rem'
  },
  h5: {
    ...header,
    fontSize: '1.8rem',
    letterSpacing: '-0.05rem',
    lineHeight: '2.8rem'
  },
  h6: {
    ...header,
    fontSize: '1.2rem',
    lineHeight: '1.4rem',
    textTransform: 'uppercase',
    color: colors.fonts.secondary,
    fontFamily: 'Roboto-Regular, Roboto, ArialMT, Arial, sans-serif'
  },

  // BODY & P /////////////////////////////////////////////////////////////////
  body,
  p: {
    ...body,
    color: 'rgb(35, 35, 30)',
    fontWeight: '200',
    fontSize: '1.4rem',
    textAlign: 'left'
  },
  b: {
    ...body,
    fontSize: 'inherit',
    fontFamily: 'inherit',
    fontWeight: 'bold'
  },
  strong: {
    ...body,
    fontSize: 'inherit',
    fontFamily: 'inherit',
    fontWeight: 'bold'
  },
  em: {
    ...body,
    fontSize: 'inherit',
    fontFamily: 'inherit',
    fontWeight: 'bold'
  },
  span: {
    fontSize: 'inherit',
    fontFamily: 'inherit',
    fontWeight: 'inherit',
    letterSpacing: 'inherit',
    color: 'inherit'
  },
  small: {
    ...body,
    color: colors.fonts.tertiary,
    fontWeight: 'normal',
    fontSize: '1.1rem',
    lineHeight: '1.6rem'
  },
  br: {
    marginTop: '1.2rem',
    marginBottom: '1.2rem'
  },

  // Forms ////////////////////////////////////////////////////////////////////
  input: {
    ...body,
    width: '100%',
    padding: '1rem',
    height: '4rem',
    margin: '0 auto',
    marginBottom: `0.4rem`,
    marginTop: `0.8rem`,
    fontSize: '1.6rem',
    fontWeight: 'normal',
    color: colors.fonts.secondary,
    borderColor: colors.fonts.secondary,
    textAlign: 'left',
    borderRadius: '0.2rem',
    multiple: {
      height: '12rem'
    }
  },
  label: {
    ...body,
    fontSize: '1.6rem',
    color: colors.fonts.secondary,
    textAlign: 'left',
    marginBottom: '0.2rem'
  },
  error: {
    ...body,
    fontSize: '1.4rem',
    fontWeight: 'normal',
    color: colors.error,
    textAlign: 'left',
    marginBottom: '0.2rem',
    marginTop: '0.2rem',
    minHeight: '2.4rem'
  },

  // GENERIC //////////////////////////////////////////////////////////////////
  hr: {
    borderColor: colors.indigo,
    width: '100%'
  },

  button: {
    width: '27.6rem',
    fontFamily: 'Roboto-Regular, Roboto, ArialMT, Arial, sans-serif',
    fontSize: '1.6rem',
    backgroundColor: colors.primary,
    color: colors.white,
    border: '0',
    margin: '2rem 0',
    secondary: {
      backgroundColor: colors.white,
      color: colors.primary,
      border: `1px solid ${colors.primary}`,
      width: '10.4rem',
      fontSize: '1.2rem'
    }
  },

  section: {
    margin: '0.8rem auto',
    width: '100%'
  },

  overlay: {
    background: 'linear-gradient(to bottom, rgba(255,255,255,0.92) 0%,rgba(255,255,255,0.7) 100%)'
  }
}

export const getComponentTheme = (tagName) => (propName) => ({theme, themeName}) => {
  let t = theme[tagName]
  if (themeName) {
    let t2 = t[themeName] || {}
    t = {...t, ...t2}
  }
  return t[propName]
}
