import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import ShortUniqueId from 'short-unique-id'
import {
  ActionButton,
  HomeContainer,
  Paragraph,
  PostContainer,
  Spacer,
  Text
} from '../../styles/components/Common-styles'
import { objectToBase64 } from '../../utils/toBase64'

const uid = new ShortUniqueId({
  length: 10
})

export const Home = () => {
  const username = useSelector((state) => state.auth?.user?.name)
  const useraddress = useSelector((state) => state.auth?.user?.address)
  const [text, setText] = useState('')

  const handlePost = async () => {
    try {
      if (!text) throw new Error('Please enter some text for the post')
      if (!username) throw new Error('Cannot post without a name')
      const postObject = {
        text,
        version: 1
      }
      const postObjectToBase64 = await objectToBase64(postObject)

      // metadata
      // title has a max of 60 characters
      // description has a max of 240 chararects. Since metadata will be available before the json content , we'll use the 180 characters to give a 'preview'
      // identifier has a max of 64 characters
      const description = text.slice(0, 180)
      // The creation of the identifier is up to you.
      // This is how I would do it:
      const ownerName = window._qdnName
      if (!ownerName) throw new Error('Cannot retrieve app name')
      const responseNameData = await qortalRequest({
        action: 'GET_NAME_DATA',
        name: ownerName
      })
      const ownerAddress = responseNameData.owner
      const uniqueAppId = ownerAddress.slice(0, 5) + ownerName
      const randomId = uid()
      const identifier = `${uniqueAppId}_post_${username}_${randomId}`
      let requestBody = {
        action: 'PUBLISH_QDN_RESOURCE',
        name: username,
        service: 'BLOG_POST',
        data64: postObjectToBase64,
        description: description,
        identifier: identifier
      }
      await qortalRequest(requestBody)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <HomeContainer>
      {username && <Paragraph>Welcome {username}</Paragraph>}
      <PostContainer>
        <Text
          multiline={true}
          inputProps={{
            maxLength: 250
          }}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Spacer size={2} />
        <ActionButton onClick={handlePost}>Post</ActionButton>
      </PostContainer>
    </HomeContainer>
  )
}
