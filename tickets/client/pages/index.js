import * as React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

const HomePage = ({ currentUser, tickets }) => {
  const formattedTickets = tickets.map((ticket) =>
    (<tr key={ticket.title}>
      <td><Link href={'/tickets/[ticketId]'} as={`/tickets/${ticket.id}`}>{ticket.title}</Link></td>
      <td>{ticket.price}</td>
    </tr>)
  )
  return (
  <>
    <h1>Boom</h1>
    {currentUser && <p>You&apos;re signed in</p>}
    Check out your tickets
    <table className='table'>
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {formattedTickets}
      </tbody>
    </table>
  </>
  )
}

HomePage.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/tickets')
  return { tickets: data }
}

HomePage.propTypes = {
  currentUser: PropTypes.object,
  tickets: PropTypes.array
}

export default HomePage
