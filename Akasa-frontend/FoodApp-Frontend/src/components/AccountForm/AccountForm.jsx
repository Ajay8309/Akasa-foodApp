import { Button, HelperText, Input, Label } from "@windmill/react-ui";
import { useUser } from "../../context/UserContext";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PulseLoader from "react-spinners/PulseLoader";
import styles from "./AccountForm.module.css"; 

const AccountForm = ({ setShowSettings, userData }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      fullname: userData?.fullname,
      email: userData?.email,
      username: userData?.username,
      address: userData?.address,
      country: userData?.country,
      city: userData?.city,
      state: userData?.state,
    },
  });
  const [validationError, setValidationError] = useState();
  const [isSaving, setIsSaving] = useState(false);
  const { updateUserData } = useUser();

  const onSubmit = async (data) => {
    setValidationError();
    setIsSaving(true);
    try {
      await updateUserData(data);
      setShowSettings(false);
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      setValidationError(error.response.data.message);
    }
  };

  return (
    <section className={styles.accountFormContainer}>
      <div className={styles.accountFormCard}>
        <div className={styles.accountFormHeader}>
          <h3 className={styles.accountFormTitle}>Account settings</h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.accountFormContent}>
          <Label className={styles.accountFormLabel}>
            <span className="text-sm font-medium text-gray-500 w-1/4">Full name</span>
            <Input
              name="fullname"
              {...register("fullname")}
              className={styles.accountFormInput}
            />
          </Label>
          <Label className={styles.accountFormLabel}>
            <span className="text-sm font-medium text-gray-500">Username</span>
            <Input
              name="username"
              {...register("username")}
              className={styles.accountFormInput}
            />
            {validationError && <HelperText className={styles.accountFormHelperText}>{validationError.username}</HelperText>}
          </Label>
          <div className={styles.accountFormLabel}>
            <span className="text-sm font-medium text-gray-500">Email address</span>
            <Input
              name="email"
              {...register("email", {
                required: "Email required",
                pattern: {
                  value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Email not valid",
                },
              })}
              className={styles.accountFormInput}
            />
            {validationError && <HelperText className={styles.accountFormHelperText}>{validationError.email}</HelperText>}
          </div>
          <Label className={styles.accountFormLabel}>
            <span className="text-sm font-medium text-gray-500">Address</span>
            <Input
              name="address"
              {...register("address")}
              className={styles.accountFormInput}
            />
          </Label>
          <Label className={styles.accountFormLabel}>
            <span className="text-sm font-medium text-gray-500">City</span>
            <Input
              name="city"
              {...register("city")}
              className={styles.accountFormInput}
            />
          </Label>
          <Label className={styles.accountFormLabel}>
            <span className="text-sm font-medium text-gray-500">State</span>
            <Input
              name="state"
              {...register("state")}
              className={styles.accountFormInput}
            />
          </Label>
          <Label className={styles.accountFormLabel}>
            <span className="text-sm font-medium text-gray-500">Country</span>
            <Input
              name="country"
              {...register("country")}
              className={styles.accountFormInput}
            />
          </Label>
          <div className={styles.accountFormActions}>
            <Button disabled={isSaving} type="submit" className={styles.accountFormButton}>
              {isSaving ? <PulseLoader color={"#0a138b"} size={10} loading={isSaving} /> : "Save"}
            </Button>
            <Button
              disabled={isSaving}
              onClick={() => setShowSettings(false)}
              layout="outline"
              className={styles.accountFormButtonOutline}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AccountForm;
