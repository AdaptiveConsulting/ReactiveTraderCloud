# Reactive Trader Cloud

[![Circle CI](https://circleci.com/gh/AdaptiveConsulting/ReactiveTraderCloud.svg?style=svg&circle-token=801547883329d22e505634493b58b26fbb742e46)](https://circleci.com/gh/AdaptiveConsulting/ReactiveTraderCloud)

## Overview

[![image](https://raw.githubusercontent.com/AdaptiveConsulting/ReactiveTrader/master/images/adaptive-logo.png)](http://weareadaptive.com/)

Reactive Trader Cloud is a real-time FX trading platform demo showcasing reactive programming principles applied across the full application stack.

Improvements have been made across the board since [Reactive Trader v1](https://github.com/AdaptiveConsulting/ReactiveTrader). The UI is revamped with a modern Javascript framework (React), and an event sourcing approach is used by the backend services for data resiliency.

All frameworks and libraries used are entirely open source, and each component can be run on either Windows, Linux or Mac OS X.

The services are distributed and are capable of recovery from disconnections. This demonstrates a similar approach to what is put into practice in major financial institutions for trading systems.

-- SCREENSHOTS-HERE --

### Live Demo
A live demo can be found at [web-demo.adaptivecluster.com/](http://web-demo.adaptivecluster.com/)

## Architecture

The backend is made up of distributed services written in .NET leveraging the cross-platform capabilities provided by [DNX](https://github.com/aspnet/dnx).

Every server component can be deployed via Docker containers. This allows the use of tools such as [Kubernetes](http://kubernetes.io/) to facilitate cluster management for resiliency purposes as well as ease of deployment.

Client-side implementations are available for all major platforms, including desktop browser, OpenFin, Android, iOS, Apple Watch and WPF.

![Architecture Overview](docs/ArchitectureOverview.png)

### Front-End

The front-end is written in Javascript with React. 

### Back-End

The back-end services are cross-platform. For details of how to set up the services on your on machine see below.

## Getting Started

Get your environment setup and start up the various component parts running on your environment of choice. 

+ [Windows](docs/setup/windows-setup.md)
+ [Mac](docs/setup/macos-setup.md)
+ [Linux](docs/setup/linux-setup.md)
+ [Docker](docs/setup/docker-setup.md)

## Concepts

+ [vNext Client Architecture with ES.next, React, Webpack, RxJs](docs/articles/vNextClientArchitecture.md)
+ [DNX (.NET Execution Environment): Cross Platform .Net Development](docs/articles/dnx.md)
+ [Event Sourcing](docs/articles/eventSourcing.md)
+ [Web Messaging with WAMP & Crossbar](docs/articles/webMessaging.md)
+ [Always Connected Apps in a Microservice Environment](docs/articles/alwaysConnectedApps.md)
+ [Desktop Client Support with OpenFin](docs/articles/desktopClientWithOpenFin.md)
+ [Failover and Resiliency in a Microservice Environment](docs/articles/failOverAndResiliency.md)
+ [Deployment with Docker](docs/articles/deploymentWithDocker.md)

## Who Are We?

Reactive Trader was written by the team at [Adaptive](http://weareadaptive.com/), a consultancy that specialises in building real time trading systems. We have many years of experience in building trading systems for clients with highly demanding latency and reliability requirements. Over the years we have learnt quite a few lessons, and wanted to talk about and point to examples of how we solve technical problems related to real time delivery of messages.

## Links 
[Further Inspiration](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

