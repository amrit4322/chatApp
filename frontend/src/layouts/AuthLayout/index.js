import React, { Component, useEffect } from 'react';
import withRouter from "../../components/withRouter";
import { connect, useDispatch, useSelector } from "react-redux"
import PropTypes from "prop-types";


//Import Components
import LeftSidebarMenu from "./LeftSidebarMenu";
import { userLayout } from '../../redux/slice.auth';

const Index =(props)=> {
    const dispatch = useDispatch();
    //function for capital first letter of current page pathname
    const capitalizeFirstLetter = (name) => {
        return name.charAt(1).toUpperCase() + name.slice(2);
    };

    let layout = useSelector((state)=>state.user.layout);
    
  
    useEffect(() => {
        dispatch(userLayout({
            layout:layout
        }))

        const currentage = capitalizeFirstLetter(props.router.location.pathname);
        document.title = currentage + ' | Chatvia - Responsive Bootstrap 5 Admin Dashboard';

    }, [dispatch,layout, props.router.location.pathname]);
        return (
            <div className="layout-wrapper d-lg-flex">
                    {/* left sidebar menu */}
                    <LeftSidebarMenu />
                        {/* render page content */}
                        {props.children}
                </div>
        );
    
}

// Index.propTypes = {
//     layoutMode: PropTypes.any,
//   };

const mapStateToProps = state => {
    const { layout } = state.user;
    return { layout };
  };

export default withRouter(connect(mapStateToProps)(Index))