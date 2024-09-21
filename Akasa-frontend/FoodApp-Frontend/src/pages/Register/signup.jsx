import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button, HelperText } from "@windmill/react-ui";
import { Link, Navigate, useLocation } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useUser } from "../../context/UserContext";
import API from "../../api/axios.config";
import styles from "../Register/signup.module.css"; // Importing modular CSS
import Logoo from "../../assets/logo.png";
import MailIcon from "../../assets/mailIcon.png";
import PasswordIcon from "../../assets/passwordIcon.png";

const Register = () => {
  const { isLoggedIn, setUserState } = useUser();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useLocation();
  const [emailClicked, setEmailClicked] = useState(false);
  const [passwordClicked, setPasswordClicked] = useState(false);
  const [confirmPasswordClicked, setConfirmPasswordClicked] = useState(false);
  const [UsernameClicked, setUsernameClicked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      password2: "",
    },
  });

  const password = useRef({});
  password.current = watch("password", "");

  const onSubmit = async (data) => {
    const { username, email, password, password2, name } = data;

    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }

    try {
      setError("");
      setIsLoading(true);
      const response = await API.post("/auth/signup", {
        username,
        email,
        password,
        fullname: name,
      });
      toast.success("Account created successfully.");
      setTimeout(() => {
        setUserState(response.data);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      setError(error.response?.data.message);
    }
  };

  if (isLoggedIn) {
    return <Navigate to={state?.from || "/"} />;
  }

  return (
    <div className={styles.MainContainer}>
      <div className={styles.containerNav}>
        <div className={styles.rightContainer}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.loginContainer}>
            <div className={styles.upperSection}>
              <div className={styles.logoo}>
                <img src={Logoo} alt="Logo" />
              </div>
              <h2>TASTEBUD</h2>
              <p className={styles.tagline}>Adorn your moments with brilliance</p>
            </div>

            <div className={styles.wrapContainer}>
              <div className={styles.in}>
                <div className={`${styles.placeholder} ${emailClicked ? styles.clicked : ""}`}>
                  Email
                </div>
                <div className={styles.mailIcon}>
                  <img src={MailIcon} alt="Mail Icon" />
                </div>
                <input
                  className={styles.intag}
                  onClick={() => setEmailClicked(true)}
                  type="email"
                  onBlur={() => setEmailClicked(false)}
                  {...register("email", {
                    required: "Email required",
                    pattern: {
                      value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                      message: "Invalid email",
                    },
                  })}
                  placeholder=""
                />
                {errors.email && (
                  <HelperText valid={false}>{errors.email.message}</HelperText>
                )}
              </div>

              <div className={styles.in}>
                <div className={`${styles.placeholder} ${passwordClicked ? styles.clicked : ""}`}>
                  Password
                </div>
                <div className={styles.mailIcon}>
                  <img src={PasswordIcon} alt="Password Icon" />
                </div>
                <input
                  className={styles.intag}
                  onClick={() => setPasswordClicked(true)}
                  type="password"
                  onBlur={() => setPasswordClicked(false)}
                  {...register("password", {
                    required: "Password required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  placeholder=""
                />
                {errors.password && (
                  <HelperText valid={false}>{errors.password.message}</HelperText>
                )}
              </div>

              <div className={styles.in}>
                <div className={`${styles.placeholder} ${confirmPasswordClicked ? styles.clicked : ""}`}>
                  Confirm Password
                </div>
                <input
                  className={styles.intag}
                  onClick={() => setConfirmPasswordClicked(true)}
                  type="password"
                  onBlur={() => setConfirmPasswordClicked(false)}
                  {...register("password2", {
                    validate: (value) =>
                      value === password.current || "Passwords do not match",
                  })}
                  placeholder=""
                />
                {errors.password2 && (
                  <HelperText valid={false}>{errors.password2.message}</HelperText>
                )}
              </div>

              <div className={styles.in}>
                <div className={`${styles.placeholder} ${UsernameClicked ? styles.clicked : ""}`}>
                  Username
                </div>
                <input
                  className={styles.intag}
                  onClick={() => setUsernameClicked(true)}
                  onBlur={() => setUsernameClicked(false)}
                  type="text"
                  {...register("username", {
                    required: "Username required",
                    minLength: {
                      value: 4,
                      message: "Username must be at least 4 characters",
                    },
                  })}
                  placeholder=""
                />
                {errors.username && (
                  <HelperText valid={false}>{errors.username.message}</HelperText>
                )}
              </div>

              <div className={styles.in}>
                <div className={styles.placeholder}>Fullname</div>
                <input
                  className={styles.intag}
                  type="text"
                  {...register("name", {
                    required: "Fullname required",
                    minLength: {
                      value: 6,
                      message: "Fullname must be at least 6 characters",
                    },
                  })}
                  placeholder=""
                />
                {errors.name && (
                  <HelperText valid={false}>{errors.name.message}</HelperText>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={styles.btn1}
            >
              {isLoading ? (
                <PulseLoader color={"#0a138b"} size={10} loading />
              ) : (
                "Create Account"
              )}
            </Button>

            {error && (
              <HelperText valid={false}>{error}</HelperText>
            )}

            <p className={styles.signupEnd}>
              Have an account?{" "}
              <Link to="/login" className={styles.signLink}>
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
