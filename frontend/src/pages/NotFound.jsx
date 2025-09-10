import { Link } from 'react-router-dom'

export default function NotFound(){
  return (
    <div className="card">
      <h2>404 – Not Found</h2>
      <p className="muted">The page you are looking for does not exist.</p>
      <Link className="btn" to="/">Go Home</Link>
    </div>
  )
}
