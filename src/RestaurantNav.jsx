//the navbar for restaurant with link to Order component
import { Link } from "react-router-dom";
import { Component } from "react";

class RestaurantNav extends Component {
    state = {
        cartCount: 0
    }
    render() {
        return (
            // adds bootstrap navbar
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    {/* company name */}
                    <h1 className="navbar-brand">A la Cart</h1>
                    {/* responsive features */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {/* nav links */}
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/Orders">Orders</a>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" to="/" onClick={this.logOutRestaurant}>Log Out</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }

    // method to update database for restaurant logout
    logOutRestaurant = () => {
        fetch(`http://localhost:5000/Users/2`,
            {
                method: "PATCH",
                body: JSON.stringify({
                    "isLoggedIn": false
                }),
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            }
        )
        // reloads page to logout
        setTimeout(() => {
            window.location.reload(false);
        }, 100)
    }
}

export default RestaurantNav;