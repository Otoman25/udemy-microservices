import Router from 'next/router'
import { useEffect } from 'react'
import useRequest from '../../hooks/useRequest'
import * as React from 'react'

const SignOut = () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post'
  })

  useEffect(() => {
    doRequest().then(() => Router.push('/'))
  }, [])

  return <></>
}

export default SignOut
