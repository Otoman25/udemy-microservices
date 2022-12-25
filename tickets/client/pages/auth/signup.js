import Router from 'next/router'
import { useState } from 'react'
import useRequest from '../../hooks/useRequest'

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/')
  })

  const onSubmit = async (event) => {
    event.preventDefault()
    await doRequest()
  }

  return (<>
        <div className="card col-sm-6">
            <form onSubmit={onSubmit}>
                <div className="card-body">
                    <h3 className="card-title">Sign up</h3>
                    <div className="form-group card-text">
                        <label>Email Address</label>
                        <input className="form-control" type="text" name="email" value={email} onChange={e => setEmail(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input className="form-control" type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    {errors}
                    <br/>
                    <button className="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
        </>)
}

export default SignUp
