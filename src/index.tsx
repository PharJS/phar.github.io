import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import * as OfflinePluginRuntime from 'offline-plugin/runtime'
import { I18nextProvider } from 'react-i18next'
import theme from 'theme'

import { Provider } from 'react-redux'
import RootStore from 'store/Root'
import App from 'components/app'

import i18n from 'i18n'

OfflinePluginRuntime.install()

ReactDOM.render(
  <Provider store={RootStore()} >
    <I18nextProvider i18n={i18n}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </MuiThemeProvider>
    </I18nextProvider>
  </Provider>,
  document.getElementById('root')
)
