import { Box, Button, TextField, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getAllUser,
  updateAvatar,
  updateInfo,
  updatePassword,
} from "../../redux/userSlice";
import { IUser } from "../../types/types";
import { useEffect } from "react";
import { getAllProduct } from "../../redux/productSlice";
import { getAllCart } from "../../redux/cartSlice";
import { Toast } from "../../Util/toastify";
import { ToastContainer } from "react-toastify";
function UserDetail() {
  const userInfo = JSON.parse(localStorage.getItem("user") || "{}");

  const userList = useAppSelector((state: RootState) => state.user.users);
  const [avatarUrl, setAvatarUrl] = useState(userInfo.imgUrl);
  const dispatch = useAppDispatch();

  const formPassword = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .required("bạn chưa nhập password cũ")
        .test("wrong-oldpassword", "password cũ không đúng", (value) => {
          return value === userInfo.password;
        }),
      newPassword: Yup.string().required("bạn chưa nhập password mới"),
      confirmPassword: Yup.string()
        .required("bạn chưa nhập lại password")
        .oneOf([Yup.ref("newPassword"), null], "phải trùng với password mới"),
    }),
    onSubmit: (values, { resetForm }) => {
      if (userInfo.password !== values.newPassword) {
        dispatch(
          updatePassword({
            id: userInfo.id,
            password: values.newPassword,
          })
        );
        Toast.notify("cập nhật mật khẩu thành công");
        resetForm();
      }
    },
  });

  const handleUpdateAvatar = () => {
    dispatch(
      updateAvatar({
        id: userInfo.id,
        imgUrl: avatarUrl,
      })
    );
    if (userInfo.imgUrl !== avatarUrl) {
      Toast.notify("cập nhật avatar thành công");
    }
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const formInfo = useFormik({
    initialValues: {
      name: userInfo.name as string,
      phone: userInfo.phone as string,
      address: userInfo.address as string,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("bạn chưa nhập tên"),
      phone: Yup.string()
        .required("bạn chưa nhập số điện thoại")
        .test(
          "duplicate-phonenumber",
          "số điện thoại này đã tồn tại rồi",
          (value) => {
            return !userList.some((user) => user.phone === value);
          }
        ),
      address: Yup.string().required("bạn chưa nhập địa chỉ"),
    }),
    onSubmit: () => {
      const updatedInfo = {
        name: formInfo.values.name,
        phone: formInfo.values.phone,
        address: formInfo.values.address,
      };
      handleUpdateInfo(updatedInfo);
      if (
        userInfo.name !== updatedInfo.name ||
        userInfo.phone !== updatedInfo.phone ||
        userInfo.address !== updatedInfo.address
      ) {
        Toast.notify("cập nhật thông tin thành công");
      }
    },
  });
  const handleUpdateInfo = (updatedInfo: {
    name: string;
    phone: string;
    address: string;
  }) => {
    dispatch(
      updateInfo({
        id: userInfo.id,
        name: updatedInfo.name,
        phone: updatedInfo.phone,
        address: updatedInfo.address,
      })
    );
  };

  useEffect(() => {
    console.log("dispatch");
    dispatch(getAllProduct());
    const userInfo = JSON.parse(localStorage.getItem("user") || "{}");
    if (userInfo.id) {
      dispatch(getAllCart(userInfo.id));
    }
    dispatch(getAllUser());
  }, [dispatch]);
  console.log(formPassword.errors);

  return (
    <Box>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        theme="light"
      />      
      <Box p="20px">
        <Stack direction="row" justifyContent="space-around">
          <Stack
            direction="column"
            spacing="30px"
            bgcolor="#fff"
            sx={{ padding: "30px" }}
            height="600px"
          >
            <Box width="500px" height="500px" border="1px solid #000">
              <img src={avatarUrl} alt="" width="100%" height="100%" />
            </Box>
            <Stack
              direction="column"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Typography variant="h6" fontWeight="400" fontSize="19px">
                AVATAR URL
              </Typography>
              <TextField
                placeholder="avatar image url"
                fullWidth
                sx={{
                  "& fieldset": { borderRadius: "0" },
                  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #000",
                    borderRadius: "0",
                  },
                }}
                name="imgurl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </Stack>
            <Button
              onClick={handleUpdateAvatar}
              variant="outlined"
              sx={{
                height: "50px",
                border: "1px solid #000",
                paddingY: "10px",
                borderRadius: "0",
                color: "#000",
                bgcolor: "#fff",
                fontSize: "19px",
                "&:hover": {
                  bgcolor: "#fff",
                },
              }}
            >
              CHANGE AVATAR
            </Button>
          </Stack>
          <Stack direction="column" spacing="50px">
            <form onSubmit={formInfo.handleSubmit}>
              <Stack
                direction="column"
                width="600px"
                bgcolor="#fff"
                sx={{ padding: "20px" }}
                spacing="20px"
              >
                <Stack
                  direction="column"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Stack direction="row" alignItems="center" spacing="20px">
                    <Typography variant="h6" fontWeight="400" fontSize="19px">
                      NAME
                    </Typography>
                    {formInfo.errors.name && formInfo.touched.name && (
                      <Typography color="red" fontWeight="600">
                        {formInfo.errors.name}
                      </Typography>
                    )}
                  </Stack>
                  <TextField
                    placeholder="name"
                    fullWidth
                    sx={{
                      "& fieldset": { borderRadius: "0" },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid #000",
                        borderRadius: "0",
                      },
                    }}
                    name="name"
                    value={formInfo.values.name}
                    onChange={formInfo.handleChange}
                  />
                </Stack>
                <Stack
                  direction="column"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Stack direction="row" alignItems="center" spacing="20px">
                    <Typography variant="h6" fontWeight="400" fontSize="19px">
                      PHONE NUMBER
                    </Typography>
                    {formInfo.errors.phone && formInfo.touched.phone && (
                      <Typography color="red" fontWeight="600">
                        {formInfo.errors.phone}
                      </Typography>
                    )}
                  </Stack>
                  <TextField
                    placeholder="phonenumber"
                    fullWidth
                    sx={{
                      "& fieldset": { borderRadius: "0" },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid #000",
                        borderRadius: "0",
                      },
                    }}
                    name="phone"
                    value={formInfo.values.phone}
                    onChange={formInfo.handleChange}
                  />
                </Stack>
                <Stack
                  direction="column"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Stack direction="row" alignItems="center" spacing="20px">
                    <Typography variant="h6" fontWeight="400" fontSize="19px">
                      ADDRESS
                    </Typography>
                    {formInfo.errors.phone && formInfo.touched.phone && (
                      <Typography color="red" fontWeight="600">
                        {formInfo.errors.phone}
                      </Typography>
                    )}
                  </Stack>
                  <TextField
                    placeholder="address"
                    fullWidth
                    multiline
                    rows={4}
                    sx={{
                      "& fieldset": { borderRadius: "0" },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid #000",
                        borderRadius: "0",
                      },
                    }}
                    name="address"
                    value={formInfo.values.address}
                    onChange={formInfo.handleChange}
                  />
                </Stack>
                <Button
                  type="submit"
                  variant="outlined"
                  sx={{
                    height: "50px",
                    border: "1px solid #000",
                    paddingY: "10px",
                    borderRadius: "0",
                    color: "#000",
                    bgcolor: "#fff",
                    fontSize: "19px",
                    "&:hover": {
                      bgcolor: "#fff",
                    },
                  }}
                >
                  UPDATE INFO
                </Button>
              </Stack>
            </form>
            <form onSubmit={formPassword.handleSubmit}>
              <Stack bgcolor="#fff" sx={{ padding: "20px" }} spacing="20px">
                <Stack direction="column" justifyContent="space-between">
                  <Stack direction="row" alignItems="center" spacing="20px">
                    <Typography variant="h6" fontWeight="400" fontSize="19px">
                      OLD PASSWORD
                    </Typography>
                    {formPassword.errors.oldPassword &&
                      formPassword.touched.oldPassword && (
                        <Typography color="red" fontWeight="600">
                          {formPassword.errors.oldPassword}
                        </Typography>
                      )}
                  </Stack>
                  <TextField
                    fullWidth
                    placeholder="old password"
                    sx={{
                      "& fieldset": { borderRadius: "0" },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid #000",
                        borderRadius: "0",
                      },
                    }}
                    name="oldPassword"
                    value={formPassword.values.oldPassword}
                    onChange={formPassword.handleChange}
                  />
                </Stack>
                <Stack direction="column" justifyContent="space-between">
                  <Stack direction="row" alignItems="center" spacing="20px">
                    <Typography variant="h6" fontWeight="400" fontSize="19px">
                      NEW PASSWORD
                    </Typography>
                    {formPassword.errors.newPassword &&
                      formPassword.touched.newPassword && (
                        <Typography color="red" fontWeight="600">
                          {formPassword.errors.newPassword}
                        </Typography>
                      )}
                  </Stack>
                  <TextField
                    fullWidth
                    placeholder="new password"
                    sx={{
                      "& fieldset": { borderRadius: "0" },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid #000",
                        borderRadius: "0",
                      },
                    }}
                    name="newPassword"
                    value={formPassword.values.newPassword}
                    onChange={formPassword.handleChange}
                  />
                </Stack>
                <Stack direction="column" justifyContent="space-between">
                  <Stack direction="row" alignItems="center" spacing="20px">
                    <Typography variant="h6" fontWeight="400" fontSize="19px">
                      CONFIRM PASSWORD
                    </Typography>
                    {formPassword.errors.confirmPassword &&
                      formPassword.touched.confirmPassword && (
                        <Typography color="red" fontWeight="600">
                          {formPassword.errors.confirmPassword}
                        </Typography>
                      )}
                  </Stack>
                  <TextField
                    fullWidth
                    placeholder="confirm password"
                    sx={{
                      "& fieldset": { borderRadius: "0" },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid #000",
                        borderRadius: "0",
                      },
                    }}
                    name="confirmPassword"
                    value={formPassword.values.confirmPassword}
                    onChange={formPassword.handleChange}
                  />
                </Stack>
                <Button
                  type="submit"
                  variant="outlined"
                  sx={{
                    height: "50px",
                    border: "1px solid #000",
                    paddingY: "10px",
                    borderRadius: "0",
                    color: "#000",
                    bgcolor: "#fff",
                    fontSize: "19px",
                    "&:hover": {
                      bgcolor: "#fff",
                    },
                  }}
                >
                  UPDATE PASSWORD
                </Button>
              </Stack>
            </form>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

export default UserDetail;
