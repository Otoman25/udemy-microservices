import Link from 'next/link'

export default ({ currentUser }) => {
  const links = [
    { label: 'Sign up', href: '/auth/signup', signedInToSee: false },
    { label: 'Sign in', href: '/auth/signin', signedInToSee: false },
    { label: 'Sign out', href: '/auth/signout', signedInToSee: true }
  ].filter((link) => link.signedInToSee === (currentUser !== null))

  return (
        <nav className='navbar navbar-light bg-light'>
            <Link href='/' className='navbar-brand'>
                Home
            </Link>
            <div className='d-flex justify-content-end'>
                <ul className='nav d-flex align-items-center'>
                    {links.map(({ label, href }) => <li key={label} className='nav-link'><Link href={href}>{label}</Link></li>)}
                </ul>
            </div>
        </nav>
  )
}
