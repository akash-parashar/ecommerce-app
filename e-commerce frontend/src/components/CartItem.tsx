import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";


type cartItemProps = {
  // eslint-disable-next-line
  cartItems: any
}
const CartItem = ({cartItems}:cartItemProps) => {
  const {photo,productId,name,quantity,price} = cartItems;
  return (
    <div className="cart-item">
    <img src={photo} alt={name} />
    <article>
      <Link to={`/product/${productId}`}>{name}</Link>
      <span>₹{price}</span>
    </article>

    <div>
      <button>-</button>
      <p>{quantity}</p>
      <button> + </button>
    
    </div>
    <button>
      <FaTrash />

    </button>

 
   
  </div>
  )
}

export default CartItem