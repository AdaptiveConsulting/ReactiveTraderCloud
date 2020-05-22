import React from 'react'
import { Flex, Modal } from 'rt-components'
import { User as UserType } from 'rt-types'
import {
  Header,
  SubHeader,
  UserList,
  User,
  Avatar,
  UserRole,
  SignInButton,
  CancelButton,
  UserName
} from './styled'
import FakeUserRepository from 'apps/MainRoute/fakeUserRepository'

interface props {
  shouldShow: boolean
  closeModal: () => void
  selectUser: (user: UserType) => void
}

export const UsersModal: React.FC<props> = ({ shouldShow, closeModal, selectUser }) => (
  <Modal shouldShow={shouldShow}>
    <Flex direction="column" justifyContent="center" alignItems="center">
      <Header>Select an account</Header>
      <SubHeader>You can sign in to any of the following trading accounts. </SubHeader>
      <UserList>
        {FakeUserRepository.userList.map(user => (
          <User key={`${user.firstName}-${user.lastName}`}>
            <Avatar src={user.avatar} />
            <div>
              <UserName>
                {user.firstName} {user.lastName}
              </UserName>
              <UserRole>Account type written here</UserRole>
            </div>
            <SignInButton onClick={() => selectUser(user)}>Sign In</SignInButton>
          </User>
        ))}
      </UserList>
      <CancelButton onClick={closeModal}>Cancel</CancelButton>
    </Flex>
  </Modal>
)

export default UsersModal
