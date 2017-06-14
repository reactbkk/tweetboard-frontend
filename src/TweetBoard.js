import React from 'react'

export function TweetBoard({ tweets, bannedUsers }) {
  const tweetList = Object.keys(tweets)
    .reverse()
    .map(key => tweets[key])
    .filter(tweet => !bannedUsers[tweet.user.screen_name])
  return (
    <div>
      <header
        style={{
          position: 'absolute',
          top: 0,
          right: 12,
          height: 72,
          left: 0,
          font: '24px Avenir Next'
        }}
      >
        <strong
          style={{
            display: 'block',
            position: 'absolute',
            color: '#00D8FF',
            bottom: 12,
            left: 12
          }}
        >
          React Bangkok 2.0.0
        </strong>
        <span
          style={{
            display: 'block',
            position: 'absolute',
            right: 0,
            bottom: 12,
            background: '#00D8FF',
            color: 'black',
            padding: '4px 8px'
          }}
        >
          #reactbkk
        </span>
      </header>
      <div
        style={{
          position: 'absolute',
          top: 76,
          right: 640,
          bottom: 0,
          left: 12
        }}
      >
        <ScrollContainer>
          {tweetList.map(tweet => {
            if (tweet.retweeted_status) return null
            return (
              <ScrollItem key={tweet.id_str}>
                <Tweet tweet={tweet} />
              </ScrollItem>
            )
          })}
        </ScrollContainer>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 76,
          right: 12,
          bottom: 0,
          width: 616,
          marginLeft: 12
        }}
      >
        <Images tweetList={tweetList} />
      </div>
    </div>
  )
}

function Images({ tweetList }) {
  const images = tweetList
    .filter(tweet => {
      if (!tweet.entities) return false
      if (tweet.retweeted_status) return false
      if (!tweet.entities.media) return false
      if (!tweet.entities.media[0]) return false
      return true
    })
    .map(tweet => {
      const media = tweet.entities.media[0]
      return {
        src: media.media_url_https,
        width: media.sizes.medium.w,
        height: media.sizes.medium.h,
        tweet
      }
    })
  const rows = []
  let currentRow = null
  const finalizeRow = () => {
    const { images } = currentRow
    const max = 616
    // A(sum(basis)) + 12(n) = max
    // A = (max - 12(n)) / (sum(basis))
    const a =
      (max - (images.length - 1) * 12) / images.reduce((a, b) => a + b.basis, 0)
    rows.push({
      factor: a,
      images
    })
  }
  for (const image of images) {
    if (!currentRow) currentRow = { total: 0, images: [] }
    const basis = image.width / image.height
    image.basis = basis
    if (currentRow.total + basis >= 3.5) {
      finalizeRow()
      currentRow = { total: 0, images: [] }
    }
    currentRow.total += basis
    currentRow.images.push(image)
  }
  if (currentRow) finalizeRow()
  const cells = []
  let nextY = 0
  for (const row of rows) {
    let nextX = 0
    for (const image of row.images) {
      cells.push({
        top: nextY,
        left: nextX,
        width: image.basis * row.factor,
        height: row.factor,
        image
      })
      nextX += image.basis * row.factor + 12
    }
    nextY += row.factor + 12
  }
  return (
    <div
      style={{
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }}
    >
      {cells.filter(x => x.top < 2000).map(cell => {
        return (
          <div
            key={cell.image.tweet.id_str}
            style={{
              animation: '1s dissolve',
              transition: '0.8s all',
              position: 'absolute',
              transform: `translate(${cell.left}px, ${cell.top}px)`,
              transformOrigin: 'top left',
              width: cell.width,
              height: cell.height,
              background: `url(${cell.image.src}) center no-repeat`,
              backgroundSize: 'cover',
              overflow: 'hidden',
              borderRadius: 4
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                left: 0,
                color: 'white',
                textShadow: '0 1px 4px black, 0 1px 2px black',
                font: '1em Avenir Next',
                padding: 4
              }}
            >
              @{cell.image.tweet.user.screen_name}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Tweet({ tweet }) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        color: 'black',
        display: 'flex',
        marginBottom: 12
      }}
      className="tweet"
      onClick={() => console.log(tweet)}
    >
      <div
        style={{
          background: `url(${tweet.user.profile_image_url_https.replace(
            /_normal(\.\w+)$/,
            '$1'
          )}) center no-repeat`,
          flex: 'none',
          backgroundSize: 'cover',
          width: 80
        }}
      />
      <div style={{ padding: 8, flex: 'auto' }}>
        <div>
          <strong>{tweet.user.name}</strong>
          {' '}
          <small style={{ opacity: 0.6 }}>
            @{tweet.user.screen_name}
          </small>
        </div>
        <div
          style={{
            fontSize: 20,
            marginTop: 5,
            paddingTop: 5,
            borderTop: '1px solid #ccc'
          }}
        >
          {decode(tweet.text)}
        </div>
      </div>
    </div>
  )
}

const Entities = require('html-entities').AllHtmlEntities
const entities = new Entities()

function decode(x) {
  return entities.decode(x)
}

function TweetImage({ src }) {
  return (
    <div style={{ overflow: 'hidden', borderRadius: 4 }}>
      <img src={src} style={{ maxWidth: '100%' }} />
    </div>
  )
}

export default TweetBoard

class ScrollContainer extends React.Component {
  componentDidMount() {
    requestAnimationFrame(this.frame)
  }
  frame = () => {
    if (this.unmounted) return
    if (!this.el) return
    if (!window.pauseScrolling) {
      const lastSpeed = this.lastSpeed || 0
      const speed = Math.min(lastSpeed + 1, Math.ceil(this.el.scrollTop * 0.1))
      this.el.scrollTop -= speed
      this.lastSpeed = speed
    }
    requestAnimationFrame(this.frame)
  }
  componentWillUnmount() {
    this.unmounted = true
  }
  componentWillUpdate() {
    this.childRef = this.el && this.el.querySelector('.js-scroll-children')
    if (this.childRef) {
      this.childRefPosition = this.childRef.getBoundingClientRect().top
    }
  }
  componentDidUpdate() {
    if (this.childRef && this.el) {
      const delta =
        this.childRef.getBoundingClientRect().top - this.childRefPosition
      this.el.scrollTop += delta
    }
  }
  render() {
    return (
      <div
        ref={c => (this.el = c)}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          overflow: 'auto'
        }}
      >
        {this.props.children}
      </div>
    )
  }
}

function ScrollItem({ children }) {
  return <div className="js-scroll-children">{children}</div>
}
