import * as React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/useRequest'
import Router from 'next/router'

const ViewOrder = ({ currentUser, order }) => {
  const [timeLeft, setTimeLeft] = React.useState(0)

  React.useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = order ? new Date(order.expiresAt) - new Date() : 0
      setTimeLeft(Math.round(msLeft / 1000))
    }

    const timerId = setInterval(findTimeLeft, 1000)
    findTimeLeft()

    return () => {
      clearInterval(timerId)
    }
  }, [])

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders')
  })

  if (timeLeft < 0) return <><h4>Order has expired</h4> <Link href='/'>Go back</Link></>
  if (!order) return (<><h4>Order not found </h4> <Link href='/'>Go back</Link></>)

  console.log(order.ticket.price * 100)
  return (
  <>
    <h1>Order</h1>
    <h4>Ticket: {order.ticket.title}</h4>
    <p>You have {timeLeft} seconds left to pay</p>
    {errors}
    <StripeCheckout
    token={({ id }) => doRequest({ token: id })}
    stripeKey={process.env.NEXT_PUBLIC_STRIPE_KEY}
    amount={order.ticket.price * 100}
    email={currentUser.email}
    currency='GBP'
    />

  </>
  )
}

ViewOrder.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`).catch(err => err)

  return { order: data }
}

ViewOrder.propTypes = {
  currentUser: PropTypes.object,
  order: PropTypes.object
}

export default ViewOrder
