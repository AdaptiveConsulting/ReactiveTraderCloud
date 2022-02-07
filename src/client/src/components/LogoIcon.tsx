interface Props {
  width: number
  height: number
  active?: boolean
}

const LogoIcon: React.FC<Props> = ({ width, height, active }) => (
  <svg
    width={width * 16}
    height={height * 16}
    viewBox="0 0 21 23"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <defs />
    <g
      className={active ? "svg-icon--active" : "svg-icon"}
      stroke="none"
      strokeWidth="1"
      fill="#FFF"
      fillRule="evenodd"
    >
      <g transform="translate(-30.000000, -15.000000)">
        <g transform="translate(30.000000, 15.000000)">
          <g>
            <rect
              x="0.0664908616"
              y="4.10727682"
              width="4.43533159"
              height="17.466054"
            />
            <rect
              x="5.37542298"
              y="5.51303451"
              width="4.43533159"
              height="17.4657727"
            />
            <rect
              x="10.5390809"
              y="3.29791823"
              width="4.43505222"
              height="17.4654914"
            />
            <rect
              x="15.7024595"
              y="0.207051763"
              width="4.43561097"
              height="17.4654914"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
)

export default LogoIcon
