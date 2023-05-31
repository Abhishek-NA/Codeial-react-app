import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";

import { createComment, toggleLike } from "../api";
import { usePosts } from "../hooks";
import styles from "../styles/home.module.css";
import { Comment } from "./";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const [creatingComment, setCreatingComment] = useState(false);
  const [like, setLike] = useState(false);
  const posts = usePosts();
  const { addToast } = useToasts();

  const handleAddComment = async (e) => {
    if (e.key === "Enter") {
      setCreatingComment(true);

      const response = await createComment(comment, post._id);

      if (response.success) {
        setComment("");
        posts.addComment(response.data.comment, post._id);
        addToast("Comment created successfully!", {
          appearance: "success"
        });
      } else {
        addToast(response.message, {
          appearance: "error"
        });
      }

      setCreatingComment(false);
    }
  };

  const handlePostLike = async () => {
    const response = await toggleLike(post._id, "Post");
    if (response.success) {
      if (response.data.deleted) {
        setLike(false);
        addToast("Like Removed successfully!", {
          appearance: "success"
        });
      } else {
        setLike(true);
        addToast("Like Added successfully!", {
          appearance: "success"
        });
      }
    } else {
      addToast(response.message, {
        appearance: "error"
      });
    }
  };

  return (
    <div className={styles.postWrapper} key={post._id}>
      <div className={styles.postHeader}>
        <div className={styles.postAvatar}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQngUCT1t19810M2pdEdVJr5cyUVk807kHwzA&usqp=CAU"
            alt="user-pic"
          />
          <div>
            <Link
              to={{
                pathname: `/user/${post.user._id}`,
                state: {
                  user: post.user
                }
              }}
              className={styles.postAuthor}
            >
              {post.user.name}
            </Link>
            <span className={styles.postTime}>a minute ago</span>
          </div>
        </div>
        <div className={styles.postContent}>{post.content}</div>

        <div className={styles.postActions}>
          <div className={styles.postLike}>
            <button onClick={handlePostLike} className={styles.postLikeBtn}>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ1oCjusAWGAj_myU2oT7AYFkHfVzks1grfA&usqp=CAU"
                alt="likes-icon"
              />
            </button>
            <span>{post.likes.length}</span>
          </div>

          <div className={styles.postCommentsIcon}>
            <img
              src="data:image/png;base64,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"
              alt="comments-icon"
            />
            <span>{post.comments.length}</span>
          </div>
        </div>
        <div className={styles.postCommentBox}>
          <input
            placeholder="Start typing a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={handleAddComment}
          />
        </div>

        <div className={styles.postCommentsList}>
          {post.comments.map((comment) => (
            <Comment comment={comment} key={`post-comment-${comment._id}`} />
          ))}
        </div>
        {/* {console.log(post)} */}
      </div>
    </div>
  );
};

Post.propTypes = {
  posts: PropTypes.object.isRequired
};

export default Post;
