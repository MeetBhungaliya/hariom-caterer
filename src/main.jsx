import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import { Toaster } from './components/ui/sonner'

const rootElement = document.getElementById('root')
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
      <Toaster richColors position="top-right" />
    </StrictMode>,
  )
}
