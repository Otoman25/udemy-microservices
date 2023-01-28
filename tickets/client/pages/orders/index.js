import * as React from 'react'
import PropTypes from 'prop-types'

const AllOrders = ({ currentUser, orders }) => {
  const statusClassName = {
    cancelled: 'text-secondary',
    complete: 'text-success',
    created: 'text-info'
  }
  const formattedOrders = orders.map((order) => {
    return <tr key={order.id}><td>{order.ticket.title}</td> <td className={statusClassName[order.status]}>{order.status}</td></tr>
  })
  return (
  <>
    <h1>Orders</h1>
    <table className='table'>
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {formattedOrders}
      </tbody>
    </table>
  </>
  )
}

AllOrders.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders').catch(err => err)

  return { orders: data }
}

AllOrders.propTypes = {
  currentUser: PropTypes.object,
  orders: PropTypes.array
}

export default AllOrders
