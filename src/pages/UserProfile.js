import styles from "../styles/settings.module.css";
import { useAuth } from "../hooks";
import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { useHistory, useParams } from "react-router-dom";
import { addFriend, fetchUserProfile, removeFriend } from "../api";
import { Loader } from "../components";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [requestInProgress, setRequestInProgress] = useState(false);
  const { userId } = useParams();
  const { addToast } = useToasts();
  const history = useHistory();
  const auth = useAuth();

  // console.log(userId);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetchUserProfile(userId);

      if (response.success) {
        setUser(response.data.user);
      } else {
        addToast(response.message, { appearnce: "error" });
        history.push("/");
      }
      setLoading(false);
    };
    getUser();
  }, [userId, addToast, history]);

  if (loading) {
    return <Loader />;
  }

  const checkIfUserIsAFriend = () => {
    const friends = auth.user.friends;
    console.log(friends);
    // if (friends) {
    const friendIds = friends.map((friend) => friend.to_user._id);
    const index = friendIds.indexOf(userId);

    if (index !== -1) {
      return true;
    }
    return false;
    // }
  };

  const handleAddFriendClick = async () => {
    setRequestInProgress(true);
    const response = await addFriend(userId);

    if (response.success) {
      const { friendship } = response.data;

      auth.updateUserFriend(true, friendship);
      addToast("Friend added successfully", { appearnce: "success" });
    } else {
      addToast(response.message, { appearnce: "error" });
    }
    setRequestInProgress(false);
  };

  const handleRemoveFriendClick = async () => {
    setRequestInProgress(true);
    const response = await removeFriend(userId);

    if (response.success) {
      const friendship = auth.user.friends.filter(
        (friend) => friend.to_user._id === userId
      );

      auth.updateUserFriend(false, friendship[0]);
      addToast("Friend removed successfully", { appearnce: "success" });
    } else {
      addToast(response.message, { appearnce: "error" });
    }
    setRequestInProgress(false);
  };

  return (
    <div className={styles.settings}>
      <div className={styles.imgContainer}>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQngUCT1t19810M2pdEdVJr5cyUVk807kHwzA&usqp=CAU"
          alt=""
        />
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>Email</div>
        <div className={styles.fieldValue}>{user?.email}</div>
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>Name</div>

        <div className={styles.fieldValue}>{user?.name}</div>
      </div>
      <div className={styles.btnGrp}>
        {checkIfUserIsAFriend() ? (
          <button
            className={`button ${styles.saveBtn}`}
            onClick={handleRemoveFriendClick}
            disabled={requestInProgress}
          >
            {requestInProgress ? "Removing friend..." : "Remove Friend"}
          </button>
        ) : (
          <button
            className={`button ${styles.saveBtn}`}
            onClick={handleAddFriendClick}
            disabled={requestInProgress}
          >
            {requestInProgress ? "Adding friend..." : "Add Friend"}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
