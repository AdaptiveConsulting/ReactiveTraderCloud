// import _ from 'lodash'
// import React, { Component } from 'react'

// import * as GreenKeyRecognition from './GreenKeyRecognition'

// declare const MediaRecorder: any
// declare const requestIdleCallback: any

// export interface Props {
//   audioContext: AudioContext
// }

// export default class Session extends React.Component<Props, any> {
//   state = {
//     started: false,
//     results: [],
//   } as any

//   async componentDidMount() {
//     await this.ensureMediaStream()
//   }

//   componentWillUnmount() {
//     clearInterval(this.intervalId)
//     _.attempt(() => this.recorder.stop())
//   }

//   socket = GreenKeyRecognition.createWebSocket({
//     onmessage: (event: MessageEvent) => {
//       if (event.data) {
//         const data = JSON.parse(event.data)
//         const transcripts = _.map(data.segments, 'clean_transcript').map(transcript => [{ transcript }])

//         if (data.segments && data.segments.length) {
//           this.setState({ results: transcripts })
//         }
//       }
//     },
//     onclose: (event: CloseEvent) => {
//       this.stop()
//     },
//   })

//   audioContext = this.props.audioContext
//   destination = this.audioContext.createMediaStreamDestination()

//   recorder = createMediaRecorder(this.destination.stream, {
//     ondataavailable: async (evt: any) => {
//       let socket = await this.socket
//       // push each chunk (blobs) in an array
//       if (evt.data instanceof Blob) {
//         if (socket.readyState === 1) {
//           socket.send(evt.data)
//         }
//       }
//     },
//     onstop: async (evt: any) => {
//       let socket = await this.socket

//       socket.send('EOS')
//     },
//   })

//   analyser: AnalyserNode = _.assign(this.audioContext.createAnalyser(), {
//     fftSize: 32,
//     smoothingTimeConstant: 0.95,
//   })
//   analyserData = new Float32Array(this.analyser.frequencyBinCount)
//   mediaStream: MediaStream
//   microphone: MediaStreamAudioSourceNode

//   intervalId = setInterval(() => {
//     if (this.recorder.state === 'recording') {
//       requestIdleCallback(() => this.recorder.requestData())
//     }
//   }, 500)

//   stop() {
//     let socket = await this.socket
//   }

//   async ensureMediaStream() {
//     if (!this.mediaStream) {
//       this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
//       this.microphone = this.audioContext.createMediaStreamSource(this.mediaStream)

//       this.microphone.connect(this.analyser)
//       this.analyser.connect(this.destination)

//       this.recorder.start()
//     }

//     return this.mediaStream
//   }

//   render() {
//     return null
//   }
// }

// function createMediaRecorder(mediaStream: MediaStream, options: any): typeof MediaRecorder {
//   return Object.assign(new MediaRecorder(mediaStream), options)
// }
