import React, { Component } from 'react'

import SocialButton from '../components/socialButton'
import UserCard from '../components/userCard'

export default class Demo extends Component {
  constructor (props) {
    super(props)

    this.state = {
      logged: false,
      user: {},
      currentProvider: ''
    }
    this.nodes = {}

    this.onLoginSuccess = this.onLoginSuccess.bind(this)
    this.onLoginFailure = this.onLoginFailure.bind(this)
    this.onLogoutSuccess = this.onLogoutSuccess.bind(this)
    this.onLogoutFailure = this.onLogoutFailure.bind(this)
    this.logout = this.logout.bind(this)
  }

  setNodeRef (provider, node) {
    if (node) {
      this.nodes[ provider ] = node
    }
  }

  onLoginSuccess (user) {
    console.log("onLoginSuccess, user:", JSON.stringify(user));

    this.setState({
      logged: true,
      currentProvider: user._provider,
      user
    })
  }

  onLoginFailure (err) {
    //console.log("onLoginFailure, err:", err);

    this.setState({
      logged: false,
      currentProvider: '',
      user: {}
    })
  }

  onLogoutSuccess () {
    console.error("onLogoutSuccess");
    this.setState({
      logged: false,
      currentProvider: '',
      user: {}
    })
  }

  onLogoutFailure (err) {
    console.error("onLogoutFailure, err:", err);
    console.error(err)
  }

  logout () {
    const { logged, currentProvider } = this.state

    if (logged && currentProvider) {
      this.nodes[currentProvider].props.triggerLogout()
    }
  }

  render () {
    let children

    if (this.state.logged) {
      children = <UserCard user={this.state.user} logout={this.logout} />
    } else {
      children = [
        <SocialButton
        provider='yahoo'
        appId='dj0yJmk9cUhhUWRaTWhyNWFHJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTUy'
        redirect="http://teamtrack.site"
        onLoginSuccess={this.onLoginSuccess}
        onLoginFailure={this.onLoginFailure}
        onLogoutSuccess={this.onLogoutSuccess}
        onLogoutFailure={this.onLogoutFailure}
        getInstance={this.setNodeRef.bind(this, 'yahoo')}
        key={'yahoo'}
      >
        Login with Yahoo
      </SocialButton>,
        <SocialButton
          autoCleanUri
          provider='instagram'
          appId='afdf675d26214280ac9a792afea5651c'
          redirect={process.env.INSTAGRAM_REDIRECT}
          onLoginSuccess={this.onLoginSuccess}
          onLoginFailure={this.onLoginFailure}
          onLogoutSuccess={this.onLogoutSuccess}
          getInstance={this.setNodeRef.bind(this, 'instagram')}
          key={'instagram'}
        >
          Login with Instagram
        </SocialButton>
    ]

      // Amazon only supports HTTPS
      if (window.location.protocol === 'https:') {
        children.push(
          <SocialButton
            provider='amazon'
            appId='amzn1.application-oa2-client.26aaf63624854cbcaa084735a0fc47ed'
            onLoginSuccess={this.onLoginSuccess}
            onLoginFailure={this.onLoginFailure}
            onLogoutSuccess={this.onLogoutSuccess}
            getInstance={this.setNodeRef.bind(this, 'amazon')}
            key={'amazon'}
          >
            Login with Amazon
          </SocialButton>
        )
      } else {
        // We donâ€™t use HTTPS because of Gatekeeper, but it can be enabled if Gatekeeper is served over HTTPS
        children.push(
          <SocialButton
            autoCleanUri
            provider='github'
            gatekeeper='http://localhost:9999'
            appId='fc065f8f39ad34be8f09'
            redirect='http://teamtrack.com'
            onLoginSuccess={this.onLoginSuccess}
            onLoginFailure={this.onLoginFailure}
            onLogoutSuccess={this.onLogoutSuccess}
            getInstance={this.setNodeRef.bind(this, 'github')}
            key={'github'}
          >
            Login with GitHub OAuth
          </SocialButton>
        )
      }
    }

    return children
  }
}

