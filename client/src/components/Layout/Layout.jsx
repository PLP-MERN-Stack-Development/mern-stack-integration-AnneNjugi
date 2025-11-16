import Navbar from './Navbar'
import './Layout.css'

const Layout = ({ children }) => {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <div className="container">{children}</div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 MERN Blog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
