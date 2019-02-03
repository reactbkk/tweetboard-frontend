# tweetboard-frontend

Live Twitter feed display.

![Screenshot](tweetboard-screenshot.png)

## How it works

1. [tweetboard-backend](https://github.com/reactbkk/tweetboard-backend) connects to [Twitter’s streaming API](https://developer.twitter.com/en/docs/tutorials/consuming-streaming-data.html) and sends them to Firebase Realtime Database. That means tweets will show up immediately, without having to wait for a refresh.

2. tweetboard-frontend subscribes to Firebase Realtime Database displays the tweets.

## Features

- Smooth transitions.

- Animated image gallery.

- To fight spam bots, you can click on a tweet and ban the author. Their tweets will no longer be displayed.
