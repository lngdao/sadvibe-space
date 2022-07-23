import React, { ErrorInfo, ReactNode } from 'react'
import Lottie from 'lottie-react';
import errorJson from './asset/lottieJson/error.json'
import { withTranslationHOC } from './hooks/withTranslationHOC';

interface Props {
  children: ReactNode
  T: any
}

interface State {
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends React.Component<Props, State> {
  state = { error: null, errorInfo: null }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })
  }

  shouldComponentUpdate(
    nextProps: Readonly<any>,
    nextState: Readonly<any>
  ): boolean {
    return nextState.error !== nextProps.error
  }

  resetError = () => {
    this.setState({ error: null, errorInfo: null })
  }

  // Custom error screen here
  render() {
    console.log(this.props.T.welcome)
    if (this.state.error) {
      return (
        <div style={{width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column'}}>
          <Lottie style={{width: '40%', height: '40%', marginBottom: 40}} animationData={errorJson} loop />
          <h1>{this.props.T.error_page}</h1>
          <div onClick={() => window.location.reload()} style={{padding: '10px 30px', background: '#C9D8B6', marginTop: 20, borderRadius: 7, fontWeight: 600, cursor: 'pointer'}}>{this.props.T.reload.toUpperCase()}</div>
        </div>
      )
    }

    return this.props.children
  }
}

export default withTranslationHOC(ErrorBoundary)
