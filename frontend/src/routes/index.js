import React, { Suspense, useEffect } from "react";

import { Routes as SwitchRoute, Route, Navigate } from "react-router-dom";

//import routes
import { authProtectedRoutes, publicRoutes } from "./routes";

//import layouts
import NonAuthLayout from "../layouts/NonAuth";
import AuthLayout from "../layouts/AuthLayout/";

import { useDispatch, useSelector } from "react-redux";
import { logoutUser, userLayout } from "../redux/slice.auth";
import ToastComponent from "../components/ToastComponent";
import API from "../helpers/api";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};
const AuthProtected = (props) => {
  const dispatch = useDispatch();
  /*
      Navigate is un-auth access protected routes via url
      */
  const token = useSelector((state) => state.user.token);
  const testing = parseJwt(token);
  let status = false;
  if (testing?.exp) {
    if (testing.exp * 1000 > Date.now()) {
      status = true;
      
    }else{
      dispatch(logoutUser());

    }
  }
  if (props.isAuthProtected && (token == null || !status)) {
    // dispatch(logoutUser());
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }

  return <>{props.children}</>;
};

/**
 * Main Route component
 */
const Routes = () => {
  const { layout } = useSelector((state) => ({
    layout: state.user.layout,
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      userLayout({
        layout: layout,
      })
    );
    // localStorage.setItem("layoutMode",layout)
  }, [layout]);
  return (
    // rendering the router with layout
    <Suspense fallback={<div></div>}>
      <SwitchRoute>
        {/* public routes */}
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            layout={NonAuthLayout}
            element={<NonAuthLayout>{route.component}</NonAuthLayout>}
            key={idx}
            isAuthProtected={false}
          />
        ))}

        {/* private/auth protected routes */}
        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            layout={AuthLayout}
            element={
              <AuthProtected isAuthProtected={true}>
                <AuthLayout>{route.component}</AuthLayout>
              </AuthProtected>
            }
            key={idx}
            isAuthProtected={true}
          />
        ))}
      </SwitchRoute>
    </Suspense>
  );
};

export default Routes;
