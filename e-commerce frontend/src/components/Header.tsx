import { useState } from "react";
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const user = { id: "" ,role:""};
const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const logoutHandler =()=>{
    setIsOpen(false)
  }
  return (
    <nav className="header">
      <Link onClick={() => setIsOpen(false)} to={"/"}>
        HOME
      </Link>
      <Link onClick={() => setIsOpen(false)} to={"/search"}>
        <FaSearch />
      </Link>
      <Link onClick={() => setIsOpen(false)} to={"/cart"}>
        <FaShoppingBag />
      </Link>

      {user?.id ? (
        <>
          <button onClick={()=>setIsOpen((prev)=>!prev)}>
            <FaUser />
          </button>
          <dialog open={isOpen}>
            <div>
              {
                user.role==="admin" &&(
                  <Link to={"/admin/dashboard"}onClick={() => setIsOpen(false)} >
                    Admin
                  </Link>
                )
               
              }
               <Link to={"/orders"}  onClick={() => setIsOpen(false)}>
                Orders
                </Link>
              <button>
             <FaSignOutAlt/>
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <Link to={"/login"}  onClick={logoutHandler}>
          <FaSignInAlt />
        </Link>
      )}
    </nav>
  );
};

export default Header;
