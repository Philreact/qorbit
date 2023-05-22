import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToHashMap, upsertPosts } from '../globalState/postSlice'
import { checkStructure } from '../utils/checkStructure'
import { setUserAvatarMap } from '../globalState/globalSlice'

export const useFetchPosts = () => {
  const dispatch = useDispatch()
  const hashMapPosts = useSelector((state) => state.post.hashMapPosts)
  const posts = useSelector((state) => state.post.posts)
  const uniqueAppId = useSelector((state) => state.auth?.owner?.uniqueAppId)
  const userAvatarMap = useSelector((state) => state.global.userAvatarMap)
  const getResource = async (data) => {
    const { user, postId, content } = data
    console.log({ user, postId, content })
    let obj = {
      ...content,
      isValid: false
    }

    if (!user || !postId) return obj

    try {
      const responseData = await qortalRequest({
        action: 'FETCH_QDN_RESOURCE',
        name: user,
        service: 'BLOG_POST',
        identifier: postId
      })
      console.log({ responseData2: responseData })
      if (checkStructure(responseData)) {
        obj = {
          ...responseData,
          ...content,
          isValid: true
        }
      }
      return obj
    } catch (error) {}
  }

  const checkAndUpdatePost = React.useCallback(
    (post) => {
      // Check if the post exists in hashMapPosts
      const existingPost = hashMapPosts[post.id]
      if (!existingPost) {
        // If the post doesn't exist, add it to hashMapPosts
        return true
      } else if (
        post?.updated &&
        existingPost?.updated &&
        post?.updated > existingPost?.updated
      ) {
        // If the post exists and its updated is more recent than the existing post's updated, update it in hashMapPosts
        return true
      } else {
        return false
      }
    },
    [hashMapPosts]
  )

  const handleGetPost = async (user, postId, content) => {
    console.log({ user, postId, content })
    const res = await getResource({
      user,
      postId,
      content
    })
    console.log({ res })
    dispatch(addToHashMap(res))
  }

  const getAvatar = async (user) => {
    try {
      let url = await qortalRequest({
        action: 'GET_QDN_RESOURCE_URL',
        name: user,
        service: 'THUMBNAIL',
        identifier: 'qortal_avatar'
      })
      dispatch(
        setUserAvatarMap({
          name: user,
          url
        })
      )
    } catch (error) {}
  }

  const getPosts = React.useCallback(async () => {
    try {
      console.log({ uniqueAppId })
      if (!uniqueAppId) throw new Error('Cannot retrieve posts')
      const offset = posts.length
      const query = `${uniqueAppId}_post_`
      const responseData = await qortalRequest({
        action: 'SEARCH_QDN_RESOURCES',
        service: 'BLOG_POST',
        query: query,
        includeMetadata: true, // Optional - will take time to respond, so only request if necessary
        excludeBlocked: true,
        limit: 20,
        offset: offset,
        reverse: true
      })
      console.log({ responseData })
      const structureData = responseData.map((post) => {
        return {
          description: post?.metadata?.description,
          created: post?.created,
          updated: post?.updated,
          user: post.name,
          id: post.identifier
        }
      })
      dispatch(upsertPosts(structureData))

      for (const content of structureData) {
        if (content.user && content.id) {
          const shouldFetch = checkAndUpdatePost(content)
          console.log({ shouldFetch })
          if (shouldFetch) {
            handleGetPost(content.user, content.id, content)
          }
          if (content.user && content.id && !userAvatarMap[content.user]) {
            getAvatar(content.user)
          }
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }, [posts, hashMapPosts, uniqueAppId, userAvatarMap])

  return {
    getPosts
  }
}
