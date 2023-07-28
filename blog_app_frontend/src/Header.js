import {Link , Navigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "./UserContext";
import {TbLogout} from "react-icons/tb"


export default function Header() {
  const {setUserInfo,userInfo} = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);


   async function logout() {
    const response = await fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
    
  }

  const username = userInfo?.username;

  return (
    <header className=" bg-[rgba(228, 228, 236, 0.767)] p-10 flex justify-between items-center">
      <Link to="/" className="logo text-purple-900">MyBlog</Link>
      <nav>
        {username && (
          <>
            <Link to="/create" className=" font-medium rounded border border-solid border-purple-600 px-2 hover:bg-purple-600 hover:text-white">Create</Link>
            <Link onClick={logout} to="/"><a className="flex font-medium rounded border border-solid border-purple-600 px-2 hover:bg-purple-600 hover:text-white">{username} <TbLogout className=" text-[15px] mt-[2px] mx-2"/></a></Link>
          </>
        )}
        {!username && (
          <>
            <Link to="/login" className=" font-medium rounded border border-solid border-purple-600 px-2 hover:bg-purple-600 hover:text-white">Login</Link>
            <Link to="/register" className=" font-medium rounded border border-solid border-purple-600 px-2 hover:bg-purple-600 hover:text-white">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
