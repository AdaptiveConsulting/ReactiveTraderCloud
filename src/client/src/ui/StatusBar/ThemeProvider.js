// import { ThemeProvider as EmotionThemeProvider, withTheme } from 'emotion-theming'

// export const ThemeProvider = withTheme(
//   class IntentThemeProvider extends React.Component {
//     static getDerivedStateFromProps({ intent, theme }, state) {
//       if (intent !== state.intent) {
//         return {
//           intent,
//           theme: {
//             ...theme,
//             ...theme.button,
//             ...theme.button[intent],
//             motion: {
//               duration: 200
//             }
//           }
//         }
//       }
//     }

//     state = {}

//     render() {
//       return <EmotionThemeProvider theme={this.state.theme} children={this.props.children} />
//     }
//   }
// )

// export default ThemeProvider
