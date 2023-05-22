import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import ShortUniqueId from 'short-unique-id'
import {
  ActionButton,
  HomeContainer,
  Paragraph,
  PostCard,
  PostCardAvatarContainer,
  PostCardContentContainer,
  PostContainer,
  Spacer,
  Text
} from '../../styles/components/Common-styles'
import { objectToBase64 } from '../../utils/toBase64'
import { useFetchPosts } from '../../hooks/useFetchPosts'
import { Avatar, Box } from '@mui/material'

const uid = new ShortUniqueId({
  length: 10
})

export const Home = () => {
  const username = useSelector((state) => state.auth?.user?.name)
  const posts = useSelector((state) => state.post?.posts)
  const hashMapPosts = useSelector((state) => state.post?.hashMapPosts)
  const uniqueAppId = useSelector((state) => state.auth?.owner?.uniqueAppId)
  const userAvatarMap = useSelector((state) => state.global.userAvatarMap)

  const [text, setText] = useState('')
  const { getPosts } = useFetchPosts()
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

  const isCalled = useRef(false)
  useEffect(() => {
    if (uniqueAppId && !isCalled.current) {
      getPosts()
      isCalled.current = true
    }
  }, [getPosts, uniqueAppId])

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

        {posts.map((post, index) => {
          const existingPost = hashMapPosts[post.id]
          let currPost = post
          if (existingPost) {
            currPost = existingPost
          }
          let avatarUrl = ''
          if (currPost?.user && userAvatarMap[currPost.user]) {
            avatarUrl = userAvatarMap[currPost.user]
          }
          return (
            <>
              <PostCard key={currPost.id}>
                <PostCardAvatarContainer>
                  <Avatar src={avatarUrl} alt={currPost?.user} />
                </PostCardAvatarContainer>
                <PostCardContentContainer>
                  <Paragraph>{currPost?.user}</Paragraph>
                  <Spacer size={1} />
                  <Paragraph>{currPost?.text}</Paragraph>
                </PostCardContentContainer>
              </PostCard>
              <Spacer size={2} />
            </>
          )
        })}
      </PostContainer>
    </HomeContainer>
  )
}
