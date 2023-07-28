import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
  const {id} = useParams();
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect,setRedirect] = useState(false);
  const maxCharacters = 120;


  useEffect(() => {
    fetch('http://localhost:4000/post/'+id)
      .then(response => {
        response.json().then(postInfo => {
          setTitle(postInfo.title);
          setContent(postInfo.content);
          setSummary(postInfo.summary);
        });
      });
  }, []);

  async function updatePost(ev) {
    ev.preventDefault(); 
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }
    const response = await fetch('http://localhost:4000/post', {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/post/'+id} />
  }



  return (
    <form onSubmit={updatePost} className=" relative my-2 mx-20 md:my-4 md:mx-40 lg:my-4 lg:mx-48">
      <input type="title" 
             placeholder={'Title'}
             value={title}
             onChange={ev => setTitle(ev.target.value)} />
             <p className=" mt-1 text-gray-500 absolute text-[10px] font-semibold right-2">{maxCharacters - summary.length} characters remaining</p>

      <input 
      className="pt-4" type="summary"
             placeholder={'Summary'}
      maxLength="120"
             value={summary}
             onChange={ev => setSummary(ev.target.value)} />
             
      <input type="file" className=""
             onChange={ev => setFiles(ev.target.files)} />
      <Editor onChange={setContent} value={content} />
      <button className="mt-6 bg-purple-600 font-semibold hover:bg-purple-800">Update post</button>
    </form>
  );
}