import * as React from 'react'
import PropTypes from 'prop-types'
import useRequest from '../../hooks/useRequest'
import Router from 'next/router'

const NewTicket = ({ currentUser }) => {
  const [title, setTitle] = React.useState('')
  const [price, setPrice] = React.useState('')

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price
    },
    onSuccess: () => Router.push('/')
  })

  const formatPrice = (e) => {
    const value = parseFloat(price)

    if (isNaN(value)) {
      return
    }

    setPrice(value.toFixed(2))
  }

  return (
  <>
    <h1>Create a ticket</h1>
    <form onSubmit={(e) => { e.preventDefault(); doRequest() }}>
    <div className="form-group">
            <label>Title</label>
            <input className='form-control' value={title} onChange={(e) => setTitle(e.target.value)}/>
        </div>
        <div className="form-group">
            <label>Price</label>
            <input className='form-control' type='number' step='0.01' value={price} onBlur={formatPrice} onChange={(e) => setPrice(e.target.value)}/>
        </div>
        {errors}
        <button className='btn btn-primary'>Submit</button>
    </form>
  </>
  )
}

NewTicket.getInitialProps = async (context) => {
  return {}
}

NewTicket.propTypes = {
  currentUser: PropTypes.object
}

export default NewTicket
