import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import withRouter from "../../components/withRouter";
import { logoutUser } from '../../redux/slice.auth';
import { socket } from '../../helpers/socket';


/**
 * Logouts the user
 * @param {*} props 
 */
const Logout = (props) => {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => ({
        token: state.user.token,
      }));

    useEffect(()=>{
      dispatch(logoutUser());
      socket.disconnect();
    },[dispatch,props.router.navigate])
 

    if (token) {
        console.log("isUserLogout",token)
        return <Navigate to="/login" />;
      }

    return (<></>)
}

export default withRouter(connect(null)(Logout));