import styles from "../styles/settings.module.css";
import { useAuth } from "../hooks";
import { useState } from "react";
import { useToasts } from "react-toast-notifications";

const Settings = () => {
  const auth = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(auth.user?.name ? auth.user.name : "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingForm, setSavingForm] = useState(false);
  const { addToast } = useToasts();

  const clearForm = () => {
    setPassword("");
    setConfirmPassword("");
  };

  const updateProfile = async () => {
    setSavingForm(true);
    let error = false;

    if (!name || !password || !confirmPassword) {
      addToast("Please fill all the fields", {
        appearance: "error"
      });
      error = true;
    }

    if (password !== confirmPassword) {
      addToast("Password and Confirm password does not match", {
        appearance: "error"
      });
      error = true;
    }

    if (error) {
      return setSavingForm(false);
    }

    const response = await auth.updateUser(
      auth.user._id,
      name,
      password,
      confirmPassword
    );

    console.log("Settings", response);

    if (response.success) {
      setEditMode(false);
      setSavingForm(false);
      clearForm();

      return addToast("User profile updated successfully", {
        appearance: "success"
      });
    } else {
      return addToast(response.message, {
        appearance: "error"
      });
    }
    // setSavingForm(false);
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
        <div className={styles.fieldValue}>{auth.user?.email}</div>
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>Name</div>
        {editMode ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <div className={styles.fieldValue}>{auth.user?.name}</div>
        )}
      </div>

      {editMode && (
        <>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.fieldLabel}>Confirm Password</div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </>
      )}

      <div className={styles.btnGrp}>
        {editMode ? (
          <>
            <button
              className={`button ${styles.saveBtn}`}
              onClick={updateProfile}
              disabled={savingForm}
            >
              {savingForm ? "Saving profile..." : "Save Profile"}
            </button>
            <button
              className={`button ${styles.editBtn}`}
              onClick={() => setEditMode(false)}
            >
              Go Back
            </button>
          </>
        ) : (
          <button
            className={`button ${styles.editBtn}`}
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Settings;
