import React from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {logout} from "../../actions/auth";

const Navbar = (props) => {
  const authLinks = (
    <ul>
      <li>
        <Link to="/profiles">
          Developers
        </Link>
      </li>
      <li>
        <Link to="/posts">
          Posts
        </Link>
      </li>
      <li>
        <Link to="/dashboard">
          <i className="fas fa-user"></i>{" "}
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li>
        <a onClick={props.logout} href="#!">
          <i className="fas fa-sign-out-alt"></i>{" "}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>
  );
  
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> DevConnector
        </Link>
      </h1>
      <React.Fragment>
        {props.isAuthenticated ?
          authLinks :
          guestLinks
        }
      </React.Fragment>    
    </nav>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.authReducer.isAuthenticated
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      dispatch(logout())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
