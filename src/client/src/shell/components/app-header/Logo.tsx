import React, { SVGAttributes } from 'react'
import { styled } from 'rt-theme'

interface LogoProps extends SVGAttributes<Element> {
  fill?: string
  size?: number
}

const Logo: React.FunctionComponent<LogoProps> = ({ fill = '#000', size = 2, style, ...props }) => {
  style = {
    width: size * 4.375 + 'rem',
    height: size + 'rem',
    ...style,
    cursor: 'pointer',
  }

  return (
    <svg
      width={style.width}
      height={style.height}
      viewBox="0 0 140 32"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      {...props}
    >
      <g fill={fill} fillRule="nonzero">
        <g>
          <rect id="Rectangle-path" x="0.086" y="5.111" width="5.796" height="22.669" />
          <rect id="Rectangle-path" x="7.025" y="6.937" width="5.796" height="22.668" />
          <rect id="Rectangle-path" x="13.774" y="4.381" width="5.796" height="22.668" />
          <rect id="Rectangle-path" x="20.522" width="5.797" height="22.668" />
        </g>
        <g transform="translate(33.956 6)">
          <path d="M11.585,0.231 L18.685,19.217 L14.352,19.217 L12.914,14.987 L5.815,14.987 L4.326,19.217 L0.124,19.217 L7.304,0.231 L11.585,0.231 Z M11.825,11.877 L9.432,4.911 L9.377,4.911 L6.906,11.877 L11.825,11.877 Z" />
          <path d="M28.672,17.461 C28.229,18.207 27.649,18.742 26.931,19.071 C26.212,19.398 25.401,19.562 24.497,19.562 C23.469,19.562 22.565,19.363 21.786,18.962 C21.004,18.565 20.363,18.023 19.858,17.341 C19.352,16.659 18.971,15.875 18.714,14.987 C18.458,14.102 18.329,13.18 18.329,12.223 C18.329,11.302 18.458,10.41 18.714,9.55 C18.971,8.691 19.352,7.932 19.858,7.278 C20.363,6.621 20.997,6.094 21.758,5.694 C22.521,5.296 23.407,5.096 24.417,5.096 C25.232,5.096 26.009,5.269 26.744,5.615 C27.48,5.961 28.061,6.471 28.486,7.144 L28.539,7.144 L28.539,0.231 L32.316,0.231 L32.316,19.217 L28.725,19.217 L28.725,17.461 L28.672,17.461 Z M28.513,10.667 C28.407,10.145 28.225,9.684 27.968,9.284 C27.711,8.887 27.378,8.562 26.971,8.313 C26.563,8.066 26.049,7.942 25.428,7.942 C24.807,7.942 24.286,8.066 23.86,8.313 C23.435,8.562 23.092,8.89 22.835,9.297 C22.579,9.705 22.392,10.171 22.278,10.695 C22.162,11.216 22.104,11.762 22.104,12.328 C22.104,12.861 22.167,13.393 22.291,13.924 C22.414,14.456 22.614,14.93 22.889,15.348 C23.164,15.765 23.509,16.101 23.926,16.358 C24.343,16.614 24.844,16.742 25.428,16.742 C26.049,16.742 26.568,16.62 26.985,16.371 C27.401,16.124 27.733,15.791 27.982,15.374 C28.229,14.958 28.408,14.483 28.513,13.951 C28.62,13.42 28.673,12.87 28.673,12.302 C28.672,11.734 28.62,11.19 28.513,10.667 Z" />
          <path d="M35.155,7.489 C35.544,6.905 36.042,6.436 36.644,6.081 C37.246,5.726 37.925,5.474 38.678,5.323 C39.431,5.172 40.19,5.097 40.953,5.097 C41.644,5.097 42.343,5.145 43.053,5.244 C43.761,5.341 44.408,5.532 44.993,5.813 C45.578,6.099 46.056,6.494 46.43,6.998 C46.801,7.503 46.987,8.172 46.987,9.005 L46.987,16.16 C46.987,16.78 47.024,17.373 47.094,17.941 C47.165,18.508 47.289,18.934 47.466,19.217 L43.638,19.217 C43.567,19.003 43.509,18.788 43.465,18.566 C43.42,18.344 43.389,18.118 43.372,17.887 C42.769,18.507 42.06,18.942 41.245,19.19 C40.429,19.437 39.595,19.562 38.745,19.562 C38.088,19.562 37.478,19.481 36.91,19.322 C36.343,19.165 35.847,18.916 35.422,18.578 C34.996,18.241 34.664,17.816 34.424,17.301 C34.185,16.788 34.065,16.177 34.065,15.468 C34.065,14.688 34.203,14.045 34.477,13.54 C34.751,13.034 35.107,12.631 35.54,12.329 C35.975,12.029 36.471,11.803 37.029,11.651 C37.588,11.502 38.151,11.381 38.718,11.292 C39.285,11.205 39.844,11.133 40.394,11.08 C40.943,11.027 41.431,10.948 41.856,10.842 C42.282,10.735 42.619,10.579 42.868,10.375 C43.114,10.172 43.23,9.875 43.213,9.484 C43.213,9.077 43.146,8.754 43.013,8.515 C42.88,8.276 42.701,8.089 42.482,7.957 C42.259,7.823 42.002,7.736 41.71,7.691 C41.417,7.647 41.102,7.623 40.766,7.623 C40.021,7.623 39.436,7.784 39.01,8.103 C38.586,8.422 38.337,8.953 38.265,9.698 L34.49,9.698 C34.543,8.811 34.765,8.076 35.155,7.489 Z M42.615,12.821 C42.373,12.9 42.117,12.967 41.842,13.019 C41.567,13.074 41.28,13.118 40.979,13.154 C40.678,13.189 40.377,13.233 40.075,13.287 C39.792,13.339 39.511,13.41 39.237,13.499 C38.962,13.587 38.722,13.708 38.519,13.859 C38.315,14.008 38.151,14.2 38.026,14.429 C37.902,14.66 37.841,14.952 37.841,15.307 C37.841,15.644 37.902,15.927 38.026,16.159 C38.151,16.388 38.32,16.569 38.531,16.703 C38.745,16.836 38.993,16.928 39.277,16.982 C39.56,17.035 39.852,17.062 40.154,17.062 C40.899,17.062 41.474,16.938 41.883,16.689 C42.289,16.441 42.591,16.144 42.787,15.799 C42.981,15.454 43.1,15.103 43.145,14.749 C43.189,14.394 43.212,14.111 43.212,13.897 L43.212,12.489 C43.053,12.631 42.853,12.742 42.615,12.821 Z" />
          <path d="M52.482,5.469 L52.482,7.224 L52.535,7.224 C52.996,6.481 53.581,5.938 54.29,5.602 C54.998,5.265 55.779,5.096 56.63,5.096 C57.71,5.096 58.641,5.301 59.422,5.708 C60.202,6.115 60.848,6.658 61.362,7.331 C61.876,8.004 62.258,8.789 62.507,9.683 C62.755,10.578 62.879,11.513 62.879,12.489 C62.879,13.41 62.755,14.296 62.507,15.148 C62.258,15.999 61.881,16.752 61.376,17.408 C60.87,18.064 60.242,18.587 59.488,18.976 C58.735,19.367 57.852,19.562 56.842,19.562 C55.99,19.562 55.206,19.388 54.49,19.044 C53.771,18.698 53.182,18.188 52.721,17.514 L52.667,17.514 L52.667,24.029 L48.891,24.029 L48.891,5.469 L52.482,5.469 Z M57.387,16.371 C57.805,16.124 58.141,15.799 58.398,15.401 C58.654,15.002 58.838,14.537 58.943,14.004 C59.049,13.472 59.103,12.932 59.103,12.382 C59.103,11.834 59.045,11.292 58.93,10.761 C58.814,10.229 58.623,9.754 58.358,9.338 C58.092,8.921 57.751,8.586 57.334,8.327 C56.917,8.071 56.407,7.942 55.805,7.942 C55.185,7.942 54.665,8.071 54.249,8.327 C53.833,8.586 53.495,8.917 53.239,9.325 C52.981,9.732 52.8,10.201 52.693,10.734 C52.587,11.266 52.534,11.815 52.534,12.382 C52.534,12.932 52.591,13.472 52.708,14.004 C52.822,14.537 53.008,15.002 53.265,15.4 C53.522,15.799 53.864,16.123 54.289,16.371 C54.715,16.62 55.229,16.742 55.831,16.742 C56.452,16.742 56.971,16.62 57.387,16.371 Z" />
          <path d="M71.925,5.469 L71.925,7.995 L69.159,7.995 L69.159,14.802 C69.159,15.44 69.265,15.866 69.478,16.079 C69.691,16.291 70.116,16.397 70.753,16.397 C70.967,16.397 71.171,16.388 71.366,16.371 C71.561,16.354 71.747,16.326 71.925,16.291 L71.925,19.217 C71.606,19.27 71.25,19.304 70.861,19.322 C70.471,19.341 70.089,19.349 69.717,19.349 C69.132,19.349 68.578,19.308 68.055,19.229 C67.532,19.149 67.071,18.995 66.673,18.765 C66.273,18.533 65.959,18.207 65.728,17.781 C65.499,17.355 65.383,16.797 65.383,16.105 L65.383,7.995 L63.096,7.995 L63.096,5.469 L65.383,5.469 L65.383,1.348 L69.159,1.348 L69.159,5.469 L71.925,5.469 Z" />
          <path d="M73.583,3.34 L73.583,0.231 L77.358,0.231 L77.358,3.34 L73.583,3.34 Z M77.358,5.469 L77.358,19.216 L73.583,19.216 L73.583,5.469 L77.358,5.469 Z" />
          <polygon points="83.231 19.217 78.524 5.469 82.487 5.469 85.385 14.855 85.438 14.855 88.336 5.469 92.086 5.469 87.433 19.216 83.231 19.216" />
          <path d="M96.675,15.918 C97.243,16.47 98.058,16.742 99.12,16.742 C99.883,16.742 100.539,16.554 101.09,16.172 C101.638,15.791 101.975,15.387 102.098,14.961 L105.423,14.961 C104.892,16.61 104.075,17.79 102.978,18.498 C101.877,19.209 100.548,19.562 98.988,19.562 C97.906,19.562 96.931,19.389 96.063,19.044 C95.195,18.698 94.458,18.207 93.856,17.569 C93.254,16.929 92.788,16.168 92.46,15.281 C92.132,14.394 91.968,13.42 91.968,12.357 C91.968,11.329 92.136,10.371 92.474,9.483 C92.811,8.598 93.288,7.831 93.91,7.184 C94.53,6.536 95.27,6.027 96.13,5.655 C96.99,5.282 97.943,5.096 98.988,5.096 C100.158,5.096 101.176,5.323 102.047,5.775 C102.915,6.228 103.629,6.834 104.186,7.596 C104.746,8.358 105.148,9.227 105.395,10.201 C105.644,11.177 105.734,12.196 105.662,13.26 L95.744,13.26 C95.797,14.483 96.107,15.37 96.675,15.918 Z M100.942,8.687 C100.491,8.191 99.802,7.942 98.882,7.942 C98.278,7.942 97.777,8.044 97.38,8.248 C96.98,8.452 96.661,8.705 96.422,9.005 C96.182,9.306 96.014,9.625 95.917,9.963 C95.819,10.3 95.761,10.601 95.744,10.866 L101.886,10.866 C101.71,9.909 101.394,9.182 100.942,8.687 Z" />
        </g>
      </g>
    </svg>
  )
}

export default styled(Logo)`
  [fill] {
    fill: ${props => props.theme.shell.textColor};
  }
`
