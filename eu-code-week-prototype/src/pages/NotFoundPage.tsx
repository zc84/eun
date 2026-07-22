import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="container placeholder-page">
      <h1>Page not found</h1>
      <p>The page you requested does not exist in this prototype.</p>
      <Link to="/">Back to home</Link>
    </section>
  )
}

