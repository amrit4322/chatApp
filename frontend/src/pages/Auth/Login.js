import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Alert,
  Form,
  Input,
  Button,
  FormFeedback,
  Label,
  InputGroup,
} from "reactstrap";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import withRouter from "../../components/withRouter";
import { useFormik } from "formik";
import * as Yup from "yup";

//i18n
import { useTranslation } from "react-i18next";

//redux store

//Import Images
import logodark from "../../assets/images/logo-dark.png";
import logolight from "../../assets/images/logo-light.png";
import { GoogleLogin } from "@react-oauth/google";
import API from "../../helpers/api";
import { loginUser, userData } from "../../redux/slice.auth";
import ToastComponent from "../../components/ToastComponent";
/**
 * Login component
 * @param {*} props
 */
const Login = (props) => {
  const apiInstance = new API();
  const dispatch = useDispatch();
  const [error,setError] = useState("")
  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();

  const responseMessage = (response) => {
    console.log(response);
  };
  const errorMessage = (error) => {
    console.log(error);
  };

  // validation
  const formik = useFormik({
    initialValues: {
      phoneNumberOrEmail: "",
      password: "",
    },
    validationSchema: Yup.object({
      phoneNumberOrEmail: Yup.string().required(
        "Username or Email is required"
      ),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      console.log("Submit is called", values);
      try {
        const isLogin = await apiInstance.post("/user/login", values);
        if (isLogin.status) {
          dispatch(
            loginUser({
              token: isLogin.message.token,
            })
          );

          const response = await apiInstance.getWithToken(
            "/user/email",
            isLogin.message.token
          );
          if (response.status) {
            dispatch(
              userData({
                user: response.message.data,
              })
            );
          }

          props.router.navigate("/dashboard");
          ToastComponent({
            message: "Logged in successfully",
            options: {
              icon: "🎉",
            },
          });
        } else {
          setError(isLogin.message.message);
        }
      } catch (error) {
        console.log("Error during Login:", error);
        // Update API error state
        setError("An error occurred. Try Logging again");
      }
    },
  });

  if (useSelector((state) => state.user.user)) {
    return <Navigate to="/" />;
  }

  return (
    <div className="account-pages mt-5 pt-sm-4">
      <Container className="max-height-0">
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <div className="text-center mb-2">
              <Link to="/" className="auth-logo mb-5 d-block">
                <img
                  src={logodark}
                  alt=""
                  height="30"
                  className="logo logo-dark"
                />
                <img
                  src={logolight}
                  alt=""
                  height="30"
                  className="logo logo-light"
                />
              </Link>

              <h4>{t("Sign in")}</h4>
              <p className="text-muted mb-4">
                {t("Sign in to continue to Chatvia")}.
              </p>
            </div>

            <Card>
              <CardBody className="p-4">
                {error && <Alert color="danger">{error}</Alert>}
                <div className="p-3">
                  <Form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                      <Label className="form-label">{t("Email")}</Label>
                      <InputGroup className="mb-3 bg-soft-light rounded-3">
                        <span
                          className="input-group-text text-muted"
                          id="basic-addon3"
                        >
                          <i className="ri-user-2-line"></i>
                        </span>
                        <Input
                          type="text"
                          id="phoneNumberOrEmail"
                          name="phoneNumberOrEmail"
                          className="form-control form-control-lg border-light bg-soft-light"
                          placeholder="Enter email"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.phoneNumberOrEmail}
                          invalid={
                            !!(
                              formik.touched.phoneNumberOrEmail &&
                              formik.errors.phoneNumberOrEmail
                            )
                          }
                        />
                        {formik.touched.phoneNumberOrEmail &&
                        formik.errors.phoneNumberOrEmail ? (
                          <FormFeedback type="invalid">
                            {formik.errors.phoneNumberOrEmail}
                          </FormFeedback>
                        ) : null}
                      </InputGroup>
                    </div>

                    <FormGroup className="mb-4">
                      <div className="float-end">
                        <Link
                          to="/forgetPassword"
                          className="text-muted font-size-13"
                        >
                          {t("Forgot password")}?
                        </Link>
                      </div>
                      <Label className="form-label">{t("Password")}</Label>
                      <InputGroup className="mb-3 bg-soft-light rounded-3">
                        <span className="input-group-text text-muted">
                          <i className="ri-lock-2-line"></i>
                        </span>
                        <Input
                          type="password"
                          id="password"
                          name="password"
                          className="form-control form-control-lg border-light bg-soft-light"
                          placeholder="Enter Password"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.password}
                          invalid={
                            formik.touched.password && formik.errors.password
                          }
                        />
                        {formik.touched.password && formik.errors.password ? (
                          <FormFeedback type="invalid">
                            {formik.errors.password}
                          </FormFeedback>
                        ) : null}
                      </InputGroup>
                    </FormGroup>

                    <div className="form-check mb-4">
                      <Input
                        type="checkbox"
                        className="form-check-input"
                        id="remember-check"
                      />
                      <Label
                        className="form-check-label"
                        htmlFor="remember-check"
                      >
                        {t("Remember me")}
                      </Label>
                    </div>

                    <div className="d-grid">
                      <Button
                        color="primary"
                        block
                        className=" waves-effect waves-light"
                        type="submit"
                      >
                        {t("Sign in")}
                      </Button>
                    </div>
                  </Form>
                </div>
              </CardBody>
            </Card>

            <div className="border-top border-dark w-100 py-3 ">
              <div className="d-flex justify-content-center mt-2">Or</div>
              <div className="footer d-flex justify-content-evenly align-items-center mt-3 ">
                <div>
                  <GoogleLogin
                    onSuccess={responseMessage}
                    onError={errorMessage}
                  />
                </div>
                {/* <div>facebook</div> */}
              </div>
            </div>
            <div className="mt-1 text-center">
              <p>
                {t("Don't have an account")} ?{" "}
                <Link
                  to="/register"
                  className="font-weight-medium text-primary"
                >
                  {" "}
                  {t("Signup now")}{" "}
                </Link>{" "}
              </p>
              {/* <p>
                © {new Date().getFullYear()} {t("Chatvia")}. {t("Crafted with")}{" "}
                <i className="mdi mdi-heart text-danger"></i>{" "}
                {t("by Themesbrand")}
              </p> */}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { user } = state.user;
  return { user };
};

export default withRouter(connect(mapStateToProps)(Login));
