import { Component } from "react";
import NavBar from "./Nav";
import MenuItem from "./MenuItem";
import { DateTime } from "luxon";
import { Link } from "react-router-dom";

class Menu extends Component {
    //Creates the menu as part of the state in base for (no add-ons)
    state = {
        menu: [],
        time: null,
        timeMinutes: null
    }

    render() {
        // renders empty cart message when no more items

        return (
            <>
                <NavBar />
                <div class="top">
                    DROP TABLE PIZZA &lt;/&gt;
                </div>
                <div class="terminalhead">
                    <div class="terminalheadtext">
                        user@ubuntu:~
                    </div>
                    <div id="circle1"></div>
                    <div id="circle2"></div>
                    <div id="circle3"></div>
                    <div class="terminal">
                        <div className="cart-div">
                            <div class="ubuntu">user@ubuntu:~$ <p class="title">menu</p></div>
                            {/* return a closed message through method if restaurant is closed */}
                            {this.closedMessage()}
                            <div className="item-grid">
                                {/* loops the array to return elements */}
                                {this.state.menu.map((item) => {
                                    //renders the item as a MenuItem component and passes in props
                                    return (<MenuItem
                                        key={item.id}
                                        item={item}>

                                    </MenuItem>);
                                })}
                            </div>
                            <div className="cart-button-div">
                                {/* link to cart component */}
                                <Link className="btn" to="/cart" onClick={this.deleteCheckout}><button className="btn btn-success" type="button">Go to Cart</button></Link>
                            </div>
                            <div class="end">
                                user@ubuntu:~$ <p class="blink"> █</p>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        )
    }

    // method to output closed message
    closedMessage = () => {
        if (this.state.time < 11 | this.state.time >= 21) {
            return (
                <h5><br></br>The restaurant is currently <strong>closed</strong>.
                    <br></br><br></br>Items can be added to your cart but can't be placed until the restaurant opens.
                    <br></br><br></br>The restaurant is open from 11:00AM to 9:00PM Pacific Standard Time.
                    <br></br><br></br>The current time is: {this.convertMilitaryTime()}.
                    <br></br><br></br></h5>
            )
        }
    }

    // method to set current time
    setTime = () => {
        // gets US Pacific time
        const zone = "America/Los_Angeles"
        const time = DateTime.now().setZone(zone).hour;
        const timeMinutes = DateTime.now().setZone(zone).minute;
        this.setState({
            time: time
        })
        this.setState({
            timeMinutes: timeMinutes
        })
    }

    // method to convert from military time to am pm
    convertMilitaryTime = () => {
        let ampm = "AM";
        let time = this.state.time;
        let minutes = this.state.timeMinutes;

        if (time >= 12) {
            ampm = "PM";
            if (time !== 12) {
                time = time - 12;
            }

        }
        if (time === 0) {
            time = 12;
        }
        // for minutes less that 10
        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        time = time + ":" + minutes + ampm;
        return (time)
    }

    // checks to see if component mounts then make HTTP requests
    componentDidMount = async () => {
        // get request from database server
        let response = await fetch(" http://localhost:5000/menu", { method: "GET" })
        // converts the json data to js array
        let menu = await response.json();
        // sets time
        this.setTime();
        // sets the state to fetched values
        this.setState({ menu: menu });
    }
}


export default Menu;