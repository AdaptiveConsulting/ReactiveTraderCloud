export default (
  <svg
    xmlns="http://www.w3.org/1999/xlink"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <defs>
      <path
        id="a"
        d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"
      />
      <path id="c" d="M0 0h50v50H0z" />
    </defs>
    <g className="svg-fill" fill="none" fillRule="evenodd">
      <mask id="b" fill="#FFF">
        <use href="#a" />
      </mask>
      <g mask="url(#b)">
        <use
          className="svg-fill"
          fill="#FFF"
          transform="translate(-13 -13)"
          href="#c"
        />
      </g>
    </g>
  </svg>
)
