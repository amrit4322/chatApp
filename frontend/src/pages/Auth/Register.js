import React, { useCallback, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import withRouter from "../../components/withRouter";

import { useFormik } from "formik";
import * as Yup from "yup";
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

//Import action

//i18n
import { useTranslation } from "react-i18next";

//Import Images
import logodark from "../../assets/images/logo-dark.png";
import logolight from "../../assets/images/logo-light.png";
import API from "../../helpers/api";

/**
 * Register component
 * @param {*} props
 */
const Register = (props) => {
  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();
  const apiInstance = new API();
  // validation
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(3, "Must be at least 3 characters")
        .required("Required")
        .matches(/^[A-Za-z ]*$/, "Please enter valid name"),
      lastName: Yup.string()
        .min(3, "Must be at least 3 characters")
        .required("Required")
        .matches(/^[A-Za-z ]*$/, "Please enter valid name"),
      email: Yup.string()
        .email("Invalid email address")
        .test(
          "has-valid-domain",
          "Email must have a .com, .org, .edu, .net, .gov domain",
          (value) => {
            if (!value) return false;
            const validDomains = ["com", "org", "edu", "net", "gov", "in"];
            const domain = value.split(".").pop()?.toLowerCase();
            return domain ? validDomains.includes(domain) : false;
          }
        )
        .required("Required"),
      phoneNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Invalid phone number")
        .required("Required"),
      password: Yup.string()
        .required("Required")
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Required"),
      // acceptTerms: Yup.boolean()
      //   .oneOf([true], "You must accept the Terms and Privacy Policy")
      //   .required("You must accept the Terms and Privacy Policy"),
    }),
    onSubmit: async (values) => {
      let data = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
      };
      console.log("Submit is called", data);
      const response = await apiInstance.post("/user/register", data);

      if (response.status) {
        props.router.navigate("/login");
      }
    },
  });

  return (
    <div className="account-pages my-5 pt-sm-5">
      <Container className="max-width-0">
        <Row className="justify-content-center">
          <Col md={9} lg={9} xl={9}>
            <div className="text-center mb-4">
              <Link to="/" className="auth-logo mb-4 d-block">
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

              <h4>{t("Sign up")}</h4>
              <p className="text-muted mb-4">
                {t("Get your Chatvia account now")}.
              </p>
            </div>

            <Card>
              <CardBody className="p-4">
                {props.error && <Alert variant="danger">{props.error}</Alert>}
                {props.user && (
                  <Alert variant="success">
                    Thank You for registering with us!
                  </Alert>
                )}
                <div className="p-3">
                  <Form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <FormGroup className="mb-3">
                          <Label className="form-label">
                            {t("First Name")}
                          </Label>
                          <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                            <span className="input-group-text border-light text-muted">
                              <i className="ri-user-2-line"></i>
                            </span>
                            <Input
                              type="text"
                              id="firstName"
                              name="firstName"
                              className="form-control form-control-lg bg-soft-light border-light"
                              placeholder="Enter First Name"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.firstName}
                              invalid={
                                formik.touched.firstName &&
                                formik.errors.firstName
                              }
                            />
                            {formik.touched.firstName &&
                            formik.errors.firstName ? (
                              <FormFeedback type="invalid">
                                {formik.errors.firstName}
                              </FormFeedback>
                            ) : null}
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup className="mb-3">
                          <Label className="form-label">{t("Last Name")}</Label>
                          <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                            <span className="input-group-text border-light text-muted">
                              <i className="ri-user-2-line"></i>
                            </span>
                            <Input
                              type="text"
                              id="lastName"
                              name="lastName"
                              className="form-control form-control-lg bg-soft-light border-light"
                              placeholder="Enter Last Name"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.lastName}
                              invalid={
                                formik.touched.lastName &&
                                formik.errors.lastName
                              }
                            />
                            {formik.touched.lastName &&
                            formik.errors.lastName ? (
                              <FormFeedback type="invalid">
                                {formik.errors.lastName}
                              </FormFeedback>
                            ) : null}
                          </InputGroup>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup className="mb-3">
                          <Label className="form-label">{t("Email")}</Label>
                          <InputGroup className="input-group bg-soft-light rounded-3">
                            <span className="input-group-text text-muted">
                              <i className="ri-mail-line"></i>
                            </span>
                            <Input
                              type="text"
                              id="email"
                              name="email"
                              className="form-control form-control-lg bg-soft-light border-light"
                              placeholder="Enter Email"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.email}
                              invalid={
                                formik.touched.email && formik.errors.email
                              }
                            />
                            {formik.touched.email && formik.errors.email ? (
                              <FormFeedback type="invalid">
                                {formik.errors.email}
                              </FormFeedback>
                            ) : null}
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup className="mb-3">
                          <Label className="form-label">
                            {t("Phone Number")}
                          </Label>
                          <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                            <span className="input-group-text border-light text-muted">
                              <i className="ri-user-2-line"></i>
                            </span>
                            <Input
                              type="text"
                              id="phoneNumber"
                              name="phoneNumber"
                              className="form-control form-control-lg bg-soft-light border-light"
                              placeholder="Enter Mobile No"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.phoneNumber}
                              invalid={
                                formik.touched.phoneNumber &&
                                formik.errors.phoneNumber
                              }
                            />
                            {formik.touched.phoneNumber &&
                            formik.errors.username ? (
                              <FormFeedback type="invalid">
                                {formik.errors.phoneNumber}
                              </FormFeedback>
                            ) : null}
                          </InputGroup>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup className="mb-4">
                          <Label className="form-label">{t("Password")}</Label>
                          <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                            <span className="input-group-text border-light text-muted">
                              <i className="ri-lock-2-line"></i>
                            </span>
                            <Input
                              type="password"
                              id="password"
                              name="password"
                              className="form-control form-control-lg bg-soft-light border-light"
                              placeholder="Enter Password"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.password}
                              invalid={
                                formik.touched.password &&
                                formik.errors.password
                              }
                            />
                            {formik.touched.password &&
                            formik.errors.password ? (
                              <FormFeedback type="invalid">
                                {formik.errors.password}
                              </FormFeedback>
                            ) : null}
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup className="mb-4">
                          <Label className="form-label">{t("Password")}</Label>
                          <InputGroup className="mb-3 bg-soft-light input-group-lg rounded-lg">
                            <span className="input-group-text border-light text-muted">
                              <i className="ri-lock-2-line"></i>
                            </span>
                            <Input
                              type="password"
                              id="confirmPassword"
                              name="confirmPassword"
                              className="form-control form-control-lg bg-soft-light border-light"
                              placeholder="Confirm Pass"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.confirmPassword}
                              invalid={
                                formik.touched.confirmPassword &&
                                formik.errors.confirmPassword
                              }
                            />
                            {formik.touched.confirmPassword &&
                            formik.errors.confirmPassword ? (
                              <FormFeedback type="invalid">
                                {formik.errors.confirmPassword}
                              </FormFeedback>
                            ) : null}
                          </InputGroup>
                        </FormGroup>
                      </Col>
                    </Row>
                    <div className="d-grid">
                      <Button
                        color="primary"
                        block
                        className=" waves-effect waves-light"
                        type="submit"
                      >
                        Sign up
                      </Button>
                    </div>
                  </Form>
                </div>
              </CardBody>
            </Card>

            <div className="mt-5 text-center">
              <p>
                {t("Already have an account")} ?{" "}
                <Link to="/login" className="font-weight-medium text-primary">
                  {" "}
                  {t("Signin")}{" "}
                </Link>{" "}
              </p>
              <p>
                © {new Date().getFullYear()} {t("Chatvia")}. {t("Crafted with")}{" "}
                <i className="mdi mdi-heart text-danger"></i>{" "}
                {t("by Themesbrand")}
              </p>
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

export default withRouter(connect(mapStateToProps)(Register));
