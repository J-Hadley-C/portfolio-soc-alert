import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Profil from './components/Profil'
import Competences from './components/Competences'
import Projets from './components/Projets'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main>
        <Hero />
        <div className="divider-line" />
        <Profil />
        <div className="divider-line" />
        <Competences />
        <div className="divider-line" />
        <Projets />
        <div className="divider-line" />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
