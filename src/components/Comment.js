import PropTypes from "prop-types";
import { useToasts } from "react-toast-notifications";
import { toggleLike } from "../api";

import styles from "../styles/home.module.css";

const Comment = ({ comment }) => {
  const { addToast } = useToasts();
  const handleCommentLike = async () => {
    const response = await toggleLike(comment._id, "Comment");
    if (response.success) {
      if (response.data.deleted) {
        addToast("Like Removed successfully!", {
          appearance: "success"
        });
      } else {
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
    <div className={styles.postCommentsItem}>
      <div className={styles.postCommentHeader}>
        <span className={styles.postCommentAuthor}>{comment.user.name}</span>
        <span className={styles.postCommentTime}>a minute ago</span>
        <span className={styles.postCommentLikes}>22</span>
      </div>
      <div className={styles.commentActions}>
        <div className={styles.postCommentContent}>{comment.content}</div>

        <div className={styles.postLike}>
          <button onClick={handleCommentLike} className={styles.commentLikeBtn}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ1oCjusAWGAj_myU2oT7AYFkHfVzks1grfA&usqp=CAU"
              alt="likes-icon"
            />
          </button>
          <span className={styles.postCommentsIcon}>
            {comment.likes.length}
          </span>
        </div>
      </div>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.object.isRequired
};

export default Comment;
