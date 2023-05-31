import { Post, Loader, CreatePost } from "../components";
import { FriendsList } from "./";
import styles from "../styles/home.module.css";
import { useAuth, usePosts } from "../hooks";

const Home = () => {
  const auth = useAuth();
  const posts = usePosts();

  if (posts.loading) {
    return <Loader />;
  }

  return (
    <div className={styles.home}>
      <div className={styles.postsList}>
        <CreatePost />

        {posts.data.map((post) => (
          // console.log("post id", post._id)
          <Post post={post} key={`post-${post._id}`} />
        ))}
      </div>
      {auth.user && <FriendsList />}
    </div>
  );
};

export default Home;
