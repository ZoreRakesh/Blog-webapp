import {useContext,useState} from "react";
import { Navigate } from "react-router-dom";
import {UserContext} from "../UserContext";


export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect,setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext);


  async function register(ev) {
    ev.preventDefault();
    const response = await fetch('http://localhost:4000/register', {
      method: 'POST',
      body: JSON.stringify({username,password}),
      headers: {'Content-Type':'application/json'},
    });
    if (response.ok) {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert('Username Already register or Error Found');

    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }
  //   if (response.status === 200) {

  //     alert('registration successful');
  //     return <Navigate to={'/login'} />
  //   } else {
  //     alert('registration failed');
  //   }
  // }
  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input type="text"
             placeholder="username"
             value={username}
             onChange={ev => setUsername(ev.target.value)}/>
      <input type="password"
             placeholder="password"
             value={password}
             onChange={ev => setPassword(ev.target.value)}/>
      <button>Register</button>
    </form>
  );
}