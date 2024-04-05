import React, { Component, useEffect } from 'react';
import withRouter from "../components/withRouter";
import { connect, useDispatch, useSelector } from "react-redux"
import PropTypes from "prop-types";
import { userLayout } from '../redux/slice.auth';
import ToastComponent from '../components/ToastComponent';

const NonAuth =(props)=> {
    
    
    const capitalizeFirstLetter = (name) => {
        return name.charAt(1).toUpperCase() + name.slice(2);
    };
    const dispatch = useDispatch();
    let layout = useSelector((state)=>state.user.layout)

    useEffect(() => {
        dispatch(userLayout({
            layout:layout
        }))

        const currentage = capitalizeFirstLetter(props.router.location.pathname);
        document.title = currentage + ' | Chatvia - Responsive Bootstrap 5 Admin Dashboard';

    }, [dispatch,layout, props.router.location.pathname]);

        return <React.Fragment>
                    <ToastComponent/>

            {props.children}
        </React.Fragment>;
    
}

NonAuth.propTypes = {
    layout: PropTypes.any,
  };

const mapStateToProps = state => {
    const { layout } = state.user;
    return { layout };
  };

export default withRouter(connect(mapStateToProps)(NonAuth))