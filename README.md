# Reactive Trader Cloud

## Overview

[![image](https://raw.githubusercontent.com/AdaptiveConsulting/ReactiveTrader/master/images/adaptive-logo.png)](http://weareadaptive.com/)

Reactive Trader Cloud is a real-time FX trading platform demo showcasing reactive programming principles applied across the full application stack.

All frameworks and libraries used are entirely open source, and each component can be run on either Windows, Linux or Mac OS X.

The services are distributed and can be recovered from disconnections - this is similar to the approach that major financial institutions use for trading systems.

![image](https://raw.githubusercontent.com/AdaptiveConsulting/ReactiveTraderCloud/master/docs/reactive-trader-screencapture.gif)

### Live demo
For a live demo, see [web-demo.adaptivecluster.com/](https://web-demo.adaptivecluster.com/)

## Architecture

The backend is made up of distributed services written in .NET using the cross-platform capabilities provided by [.NET Core](https://dotnet.github.io).

You can deploy server components via Docker containers. This means you can manage clusters using tools such as [Kubernetes](http://kubernetes.io/) for better resiliency and ease of deployment.

Client-side implementations are available for all major platforms, including desktop and mobile browser as well as OpenFin.

![Architecture Overview](https://raw.githubusercontent.com/AdaptiveConsulting/ReactiveTraderCloud/master/docs/ArchitectureOverview.png)

### Front end

The front end is written with Typescript, React, Redux and Styled components. For more details on the client-side infrastructure, see [here](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/client.md).

### Back end

The back-end services are cross-platform. For more details on the back-end infrastructure, see [here](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/server.md).

## Getting started
You can go to the [You want to](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/deployment/readme.md) page to follow build and deployment with docker

Or for more traditional builds for your platform, see [here](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/setup/getting-started.md).

## Concepts

The following topics will be covered in the upcoming weeks:

+ [vNext Client Architecture with ES.next, React, Webpack, RxJs](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/articles/vNextClientArchitecture.md)
+ [Cross Platform .Net Development](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/articles/dotnet.md)
+ [Event Sourcing](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/articles/eventSourcing.md)
+ [Web Messaging with WAMP & Crossbar](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/articles/webMessaging.md)
+ [Always Connected Apps in a Microservice Environment](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/articles/alwaysConnectedApps.md)
+ [Desktop Client Support with OpenFin](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/articles/desktopClientWithOpenFin.md)
+ [Failover and Resiliency in a Microservice Environment](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/articles/failOverAndResiliency.md)
+ [Deployment with Containers](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/blob/master/docs/articles/deploymentWithContainers.md)

## Talks and podcasts

+ [Reactive, Event Driven User Interfaces](https://vimeo.com/113716036) by Ray Booysen at NDC London 2014
+ [Event Driven User Interfaces](https://youtu.be/Tp5mRlHwZ7M) by Lee Campbell & Matt Barrett at React London 2014
+ [It's all messages now; where are my abstractions?](http://www.codesleuth.co.uk/notes/ndcoslo2015/Its-all-messages-now;-where-are-my-absractions.html) by Matt Barrett at NDC Oslo 2015
+ [The Hanselminutes: Creating Reactive User Interfaces](http://hanselminutes.com/428/creating-reactive-user-interfaces-with-adaptive-consultings-reactive-trader) with Matt Barrett
+ [Full-stack ReactiveX](http://dotnetrocks.com/?show=1333) with Qiming Liu on .NET Rocks!
+ [Developing Modern Applications in .NET core with Docker and Kubernetes](https://www.youtube.com/watch?v=70hcZO3zpnc) with Qiming Liu and James Watson

## Blog posts

To read about aspects of Reactive Trader in greater depth, check out the following blogs:
+ [Asynchrony and concurrency](http://weareadaptive.com/blog/2014/04/18/asynchrony-concurrency/) in which we discuss embracing asynchrony and concurrency at all levels of your application.
+ [Everything is a stream](http://weareadaptive.com/blog/2014/05/05/everything-is-a-stream/), in which we point out that all service calls from Reactive Trader result in streams of responses, not just a single response - and why this is so powerful.
+ [System health & failures](http://weareadaptive.com/blog/2014/06/16/system-health-failures/), in which we dig more into models of system health so you can easily respond to failures in your application, and how to use heart beating to detect component failure.
+ [John's series of blog posts on web messaging and abstractions](http://weareadaptive.com/blog/2015/06/15/series-of-blog-posts/)

## Who are we?

Reactive Trader was written by the team at [Adaptive](http://weareadaptive.com/), a consultancy that specialises in building real-time trading systems. We have many years of experience in building trading systems for clients with highly demanding latency and reliability requirements. Over the years we have learnt quite a few lessons, and wanted to talk about and point to examples of how we solve technical problems related to real-time delivery of messages.

