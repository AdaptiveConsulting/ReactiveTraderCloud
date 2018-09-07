import React from 'react'
import { styled } from 'rt-theme'
import DisconnectIcon from '../icons/DisconnectIcon'

const LoadableStyle = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.component.backgroundColor};
  color: ${({ theme }) => theme.component.textColor};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  opacity: 0.59;
`

const Spinner = styled.div`
  margin: 100px auto;
  width: 50px;
  height: 40px;
  text-align: center;
  font-size: 10px;

  & > div {
    background-color: #333;
    margin: 0 1px;
    height: 100%;
    width: 6px;
    display: inline-block;

    -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
    animation: sk-stretchdelay 1.2s infinite ease-in-out;
  }

  .rect2 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }

  .rect3 {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
  }

  .rect4 {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
  }

  .rect5 {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
  }

  @-webkit-keyframes sk-stretchdelay {
    0%,
    40%,
    100% {
      -webkit-transform: scaleY(0.4);
    }
    20% {
      -webkit-transform: scaleY(1);
    }
  }

  @keyframes sk-stretchdelay {
    0%,
    40%,
    100% {
      transform: scaleY(0.4);
      -webkit-transform: scaleY(0.4);
    }
    20% {
      transform: scaleY(1);
      -webkit-transform: scaleY(1);
    }
  }
`

interface Props {
  loading: boolean
  disconnected: boolean
  render: () => JSX.Element
}

const Loader = () => (
  <Spinner>
    <div className="rect1" />
    <div className="rect2" />
    <div className="rect3" />
    <div className="rect4" />
    <div className="rect5" />
  </Spinner>
)

const Loadable: React.SFC<Props> = ({ loading, disconnected, render }) => {
  if (loading) {
    return (
      <LoadableStyle>
        <Loader />
      </LoadableStyle>
    )
  }
  if (disconnected) {
    return (
      <LoadableStyle>
        <div>
          <DisconnectIcon width={2.75} height={3} />
        </div>
        <div>Disconnected</div>
      </LoadableStyle>
    )
  }
  return render()
}

export default Loadable
