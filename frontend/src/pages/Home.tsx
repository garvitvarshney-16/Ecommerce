import React from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

const Home = () => {
  const addToCartHandler = () => { };

  return (
    <div className='home'>
      <section></section>

      <h1>
        Latest Products
        <Link to={"/search"} className='findmore'>
          More
        </Link>
      </h1>

      <main>
        <ProductCard
          productId='ass'
          name='Mac'
          price={50000}
          stock={59}
          handler={addToCartHandler}
          photo='https://m.media-amazon.com/images/W/MEDIAX_792452-T1/images/I/81Fm0tRFdHL._AC_UY327_FMwebp_QL65_.jpg'
        />
      </main>
    </div>
  )
}

export default Home