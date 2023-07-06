import { createContext, useEffect, useState } from "react";
import {
  IPostNew,
  IPostContext,
  IPost,
  IUserProviderProps,

} from "./User/@types";
import { api } from "../../Services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const PostContext = createContext({} as IPostContext);

export const NewProvider = ({ children }: IUserProviderProps) => {
  const [newPost, setNewPost] = useState<IPostNew | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [editing, setEditing] = useState<IPost>({} as IPost);
  const [creatOpen, setCreatOpen] = useState(false);
  const [likes, setLikes] = useState<ILikes[]>([])
  const [postInternal, setPostInternal] = useState<IPost>({} as IPost)


  const navigate = useNavigate();

  useEffect(() => {
    const loadPost = async () => {
      try {
        const { data } = await api.get<IPost[]>("/posts?_embed=likes");
        setPosts(data);
      } catch (error) {
        console.log(error);
      }
    };
    loadPost();
  
  }, []);

  const addNewPost = async (formData: IPostNew) => {
    try {
      const token = localStorage.getItem("@TOKEN");
      const { data } = await api.post("/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts([...posts, data]);
      toast.success("Nova postagem feita com sucesso");
    } catch (error) {
      toast.error("Ops! Algo deu errado ao fazer a nova postagem");
    }
  };

  const eddidPost = async (formData: IPostNew, postId: number) => {
    try {
      const token = localStorage.getItem("@TOKEN");
      const { data } = await api.put(`/posts/${postId} `, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const newEddit = posts.filter((post) => post.id !== postId);
      setPosts([...newEddit, data]);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (postId: number) => {
    try {
      const token = localStorage.getItem("@TOKEN");
      await api.delete(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const newList = posts.filter((post) => post.id !== postId);
      setPosts(newList);
    } catch (error) {
      console.log(error);
    }
  };

  const editiPage = (post: IPost) => {
    setEditing(post);
    navigate("/eddidpost");
  };
  const InternalPages = async (id:number) =>{
    
    try {
      const token = localStorage.getItem("@TOKEN");
      const { data } = await api.get<IPost[]>(`users/${id}?_embed=likes`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
   
      console.log("oi");

      navigate("/InternalPages");
      setPosts(data);
    } catch (error) {
      toast.error("Ops! Algo deu errado.");
    }
  };


  return (
    <PostContext.Provider
      value={{
        newPost,
        addNewPost,
        posts,
        setPosts,
        eddidPost,
        editing,
        deletePost,
        editiPage,
        creatOpen,
        setCreatOpen,
        internalPages,
        postLikes,
        postLikesDelete,
        postInternal,
        likes,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
