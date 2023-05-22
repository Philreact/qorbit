import React from 'react'
import { styled } from '@mui/system'
import { Box, Button, TextField, Typography } from '@mui/material'

export const HomeContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  padding: '25px'
}))

export const PostContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: '600px'
}))

export const Paragraph = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  lineHeight: 1.25,
  color: theme.palette.text.primary
}))

export const Text = styled(TextField)(({ theme }) => ({
  fontSize: '16px',
  lineHeight: 1.25,
  color: theme.palette.text.primary,
  width: '100%'
}))

export const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: '#fff',
  borderRadius: '50px',
  alignSelf: 'center',
  fontSize: '18px',
  boxShadow: 'none',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    cursor: 'pointer',
    backgroundColor: theme.palette.secondary.main
  }
}))

export const Spacer = ({ size }) => {
  return <Box m={size}></Box>
}
