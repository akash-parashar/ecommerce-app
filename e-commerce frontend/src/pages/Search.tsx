import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";


const Search = () => {
  const searchQuery = useSearchParams()[0];
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState(searchQuery.get("category") || "");
  const [page, setPage] = useState(1);

const addToCartHandler = ()=>{

}

const isPrevPage = page > 1;
const isNextPage = page < 4;


  return (
    <div className=" product-search-page">
      <aside>
      <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>
        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
             <option value="">ALL</option>
             <option value="">Sameple1</option>
             <option value="">Sample2</option>

          </select>
        </div>

      </aside>
      <main>
      <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
         <div className="search-product-list">
         <ProductCard productId="asdfasdf" name="Niggabook" price={123}
        stock={123} photos="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w300/2023/10/free-images.jpg" handler={addToCartHandler}/>
          </div>
          <article>
          <button
              disabled={!isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
              </button>
            <span>
              {page} of {4}

            </span>
            <button
               disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}>next</button>
          </article>
      </main>
    </div>
  )
}

export default Search;