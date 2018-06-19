import './App.css'

import React, { Component } from 'react'

import TweetBoard from './TweetBoard'
import logo from './logo.svg'

/* global firebase */

class App extends Component {
  state = {
    tweets: {},
    bannedUsers: {}
  }
  componentDidMount() {
    const ref = firebase.database().ref('tweets/reactbkk')
    ref
      .orderByKey()
      .limitToLast(500)
      .on('value', snapshot => {
        this.setState({ tweets: snapshot.val() })
      })
    firebase
      .database()
      .ref('bannedUsers')
      .on('value', snapshot => {
        this.setState({ bannedUsers: snapshot.val() })
      })
    window.testt = () => {
      const next = { ...this.state.tweets }
      delete next[Object.keys(next).reverse()[0]]
      this.setState({ tweets: next })
    }
    if (module.hot) {
      module.hot.accept('./TweetBoard', () => {
        this.forceUpdate()
      })
    }
  }
  render() {
    return (
      <TweetBoard
        tweets={this.state.tweets}
        bannedUsers={this.state.bannedUsers}
      />
    )
  }
}

export default App
