import {formatISO9075} from "date-fns";
import {Link} from "react-router-dom";

export default function Post({_id,title,summary,cover,content,createdAt,author}) {

    return (
      <Link to={`/post/${_id}`}>

    <div className="flex flex-col w-[300px] h-[385px] mb-12">
      <div className="w-[300px] h-[200px]">
          <img className="w-full h-full object-cover rounded-lg" src={'http://localhost:4000/'+cover} alt=""/>
       
      </div>
      <div className="flex justify-between text-[10px] mt-4 mb-2">
      <time>{formatISO9075(new Date(createdAt))}</time>
      <div class=" w-40  overflow-hidden text-right">
      <a className="mr-3 truncate">{author.username}</a>
</div>
     


      </div>
      <div className=" overflow-hidden ">
        <h2 className="font-bold text-2xl line-clamp-2">{title} </h2>
        <p className=" text-base mt-2 line-clamp-3">{summary}</p>
    </div>
    </div>
    </Link>
  );
}