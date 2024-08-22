import { Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"


const Home = () => {
  const addToCartHandler =()=>{
  }
  return (
    <div className="home">
      <section>

      </section>
      <h1>
        Latest Products
        <Link to={"/search"} className="findmore">
        More..
        </Link>

      </h1>
      <main>
        <ProductCard productId="asdfasdf" name="Niggabook" price={123}
        stock={123} photos="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w300/2023/10/free-images.jpg" handler={addToCartHandler}/>
      </main>
    </div>
  )
}

export default Home