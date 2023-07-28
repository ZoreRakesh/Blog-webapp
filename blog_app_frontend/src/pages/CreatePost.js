import {useState} from "react";
import {Navigate} from "react-router-dom";
import Editor from "../Editor";

export default function CreatePost() {
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);

   const maxCharacters = 120;

 
  async function createNewPost(ev) {
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);
    ev.preventDefault();
    const response = await fetch('http://localhost:4000/post', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }
  return (
    <form onSubmit={createNewPost} className=" relative my-2 mx-20 md:my-4 md:mx-40 lg:my-4 lg:mx-48">
      <input type="title"
             placeholder={'Title'}
             value={title}
             onChange={ev => setTitle(ev.target.value)} />
             <p className=" mt-1 text-gray-500 absolute text-[10px] font-semibold right-2">{maxCharacters - summary.length} characters remaining</p>

      <input 
      className="pt-4"
      type="summary"
             placeholder={'Summary'}
      maxLength={maxCharacters}
             value={summary}
             onChange={ev => setSummary(ev.target.value)} />

      <input type="file"
             onChange={ev => setFiles(ev.target.files)} />
      <Editor value={content} onChange={setContent} />
      <button className="mt-6 bg-purple-600 font-semibold hover:bg-purple-800">Create post</button>
    </form>
  );
}