/*eslint-disable */
/*
forked from https://github.com/digidem/react-dimensions (MIT) to fix a bug with weindow reference in a popout window.
todo: deprecate once pull request goes in upstream and new react-dimensions is released
 */
import React from 'react'

const style = {
  width: '100%',
  height: '100%',
  padding: 0,
  border: 0
}

function defaultGetWidth (element) {
  return element.clientWidth
}

function defaultGetHeight (element) {
  return element.clientHeight
}

/**
 * Wraps a react component and adds properties `containerHeight` and
 * `containerWidth`. Useful for responsive design. Properties update on
 * window resize. **Note** that the parent element must have either a
 * height or a width, or nothing will be rendered
 *
 * Can be used as a
 * [higher-order component](http://babeljs.io/blog/2015/06/07/react-on-es6-plus/#property-initializers)
 * or as an [ES7 class decorator](https://github.com/wycats/javascript-decorators)
 * (see examples)
 *
 * v1.0.0 is for React v0.14 only. Use ^0.1.0 for React v0.13
 *
 * @param {object} [options] Options
 * @param {function} [options.getHeight] `getHeight(element)` should return element
 * height, where element is the wrapper div. Defaults to `element.clientHeight`
 * @param {function} [options.getWidth]  `getWidth(element)` should return element
 * width, where element is the wrapper div. Defaults to `element.clientWidth`
 * @return {function}                   Returns a higher-order component that can be
 * used to enhance a react component `Dimensions()(MyComponent)`
 *
 * ### Live Example
 *
 * Will open a browser window for localhost:9966
 *
 * `npm i && npm i react react-dom && npm start`
 *
 * @example
 * // ES2015
 * import React from 'react'
 * import Dimensions from 'react-dimensions'
 *
 * class MyComponent extends React.Component {
 *   render() (
 *     <div
 *       containerWidth={this.props.containerWidth}
 *       containerHeight={this.props.containerHeight}
 *     >
 *     </div>
 *   )
 * }
 *
 * export default Dimensions()(MyComponent) // Enhanced component
 *
 * @example
 * // ES5
 * var React = require('react')
 * var Dimensions = require('react-dimensions')
 *
 * var MyComponent = React.createClass({
 *   render: function() {(
 *     <div
 *       containerWidth={this.props.containerWidth}
 *       containerHeight={this.props.containerHeight}
 *     >
 *     </div>
 *   )}
 * }
 *
 * module.exports = Dimensions()(MyComponent) // Enhanced component
 *
 */
export default function Dimensions ({ getHeight = defaultGetHeight, getWidth = defaultGetWidth } = {}) {
  return (ComposedComponent) => {
    return class DimensionsHOC extends React.Component {
      // ES7 Class properties
      // http://babeljs.io/blog/2015/06/07/react-on-es6-plus/#property-initializers
      state = {}

      // Using arrow functions and ES7 Class properties to autobind
      // http://babeljs.io/blog/2015/06/07/react-on-es6-plus/#arrow-functions
      updateDimensions = () => {
        const container = this.refs.container
        if (!container) {
          throw new Error('Cannot find container div')
        }
        this.setState({
          containerWidth: getWidth(container),
          containerHeight: getHeight(container)
        })
      }

      onResize = () => {
        if (this.rqf) return
        this.rqf = this.getWindow().requestAnimationFrame(() => {
          this.rqf = null
          this.updateDimensions()
        })
      }

      getWindow () {
        return this.refs.container ? (this.refs.container.ownerDocument.defaultView || window) : window;
      }

      componentDidMount () {
        this.updateDimensions()
        this.getWindow().addEventListener('resize', this.onResize, false)
      }

      /* disabling because recursion, read comment here:
       https://github.com/digidem/react-dimensions/commit/de63939be6a15a9acc441665a8c103cb82443f85

       componentDidUpdate () {
       this.updateDimensions()
       }
       */

      componentWillUnmount () {
        this.getWindow().removeEventListener('resize', this.onResize)
      }

      render () {
        return (
          <div style={style} ref='container'>
            {(this.state.containerWidth || this.state.containerHeight) &&
            <ComposedComponent {...this.state} {...this.props} updateDimensions={this.updateDimensions}/>}
          </div>
        )
      }
    }
  }
}
