import * as React from 'react'
import PropTypes from 'prop-types'
import useRequest from '../../hooks/useRequest'
import Router from 'next/router'

const GetTicket = ({ currentUser, ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id
    },
    onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
  })

  return (
  <>
    <h1>{ticket.title}</h1>
    <h4>Price: {ticket.price}</h4>
    {errors}
    <button className='btn btn-primary' onClick={() => doRequest()}>Purchase</button>
  </>
  )
}

GetTicket.getInitialProps = async (context, client) => {
  const { ticketId } = context.query
  const { data } = await client.get(`/api/tickets/${ticketId}`)

  return { ticket: data }
}

GetTicket.propTypes = {
  currentUser: PropTypes.object,
  ticket: PropTypes.object
}

export default GetTicket
