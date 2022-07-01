import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => (
  <>
    <Head>
      <title>Home</title>
    </Head>
    <div className="permission_denied">
      <div className="denied__wrapper">
        <h1>404</h1>
        <h3>
          LOST IN <span>SPACE</span> App-Name? Hmm, looks like that page {"doesn't"} exist.
        </h3>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://raw.githubusercontent.com/w3itch-crafter/w3itch-frontend/886309b4905cdd1df58a2d5c9bde5d0c7a21d24a/images/astronaut.svg"
          id="astronaut"
          alt="astronaut"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://raw.githubusercontent.com/w3itch-crafter/w3itch-frontend/886309b4905cdd1df58a2d5c9bde5d0c7a21d24a/images/planet.svg"
          id="planet"
          alt="planet"
        />
        <a href="#">
          <button className="denied__link">Go Home</button>
        </a>
      </div>
    </div>
  </>
)

export default Home
