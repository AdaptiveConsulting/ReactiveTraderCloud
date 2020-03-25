import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { ThemeName, useTheme } from 'rt-theme'
import { User } from 'rt-types'
import { AdaptiveLoader } from 'rt-components'
import {
  Title,
  DropdownMenu,
  LoadingButton,
  DropdownWrapper,
  DropdownButton,
  UserAvatar,
  Circle,
  Separator,
  SignInButton,
  Option,
} from './styled'

interface Props {
  isDisplayingUserList: boolean
  user?: User
  selectUser: () => void
  logOut: () => void
}

const LoginControls = ({ isDisplayingUserList, user, selectUser, logOut }: Props) => {
  const { themeName, setTheme } = useTheme()
  const [showMenu, setShowMenu] = useState(false)

  const toggleOptions = () => {
    setShowMenu(prevShowMenu => !prevShowMenu)
  }

  const switchProfile = () => {
    toggleOptions()
    selectUser()
  }

  const signOut = () => {
    toggleOptions()
    logOut()
  }

  return (
    <>
      {isDisplayingUserList && !user ? (
        <LoadingButton>
          <AdaptiveLoader size={18} color={'white'} />
        </LoadingButton>
      ) : (
        <>
          {user ? (
            <DropdownWrapper>
              <DropdownButton onClick={toggleOptions}>
                <UserAvatar src={require(`../../users-modal/fakeAvatars/${user.avatar}`)} />
                {user.code}
                <FontAwesomeIcon icon={faAngleDown} />
              </DropdownButton>
              <DropdownMenu showMenu={showMenu}>
                <Title>Change theme</Title>
                <Option onClick={() => setTheme({ themeName: ThemeName.Light })}>
                  <Circle full={themeName === ThemeName.Light} />
                  Light
                </Option>
                <Option onClick={() => setTheme({ themeName: ThemeName.Dark })}>
                  <Circle full={themeName === ThemeName.Dark} />
                  Dark
                </Option>
                <Separator />
                <Option onClick={switchProfile}>Switch Profile</Option>
                <Option onClick={signOut}>Sign Out</Option>
              </DropdownMenu>
            </DropdownWrapper>
          ) : (
            <SignInButton onClick={selectUser}>Sign in</SignInButton>
          )}
        </>
      )}
    </>
  )
}

export default LoginControls
