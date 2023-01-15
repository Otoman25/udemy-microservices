import * as React from 'react'
import axios from 'axios'
import { useState } from 'react'

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null)

  const doRequest = async () => {
    setErrors(null)

    return axios[method](url, body).then((res) => {
      onSuccess(res.data)
    }).catch((error) => {
      if (error.response) {
        setErrors(
        <div className='alert alert-danger'>
            <h4>Oops.</h4>
            <ul className='my-0'>
                {error.response.data?.map((error, index) => <li key={index}>{error.message}</li>)}
            </ul>
        </div>
        )
      }
    })
  }

  return { doRequest, errors }
}

export default useRequest
