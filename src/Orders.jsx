import { Component } from "react";
// remove on valid login
import RestaurantNav from "./RestaurantNav";
import { DateTime } from "luxon";

//The main component that is displayed to the user
class Orders extends Component {
    // elements to be rendered dyamically
    state = {
        pageTitle: "Orders in progress",
        count: 0,
        currentTime24: null,
        currentTime: null,
        orders: null
    };

    // method to refresh page
    refreshPage = () => {
        window.location.reload(false)
    }

    // method to set current time
    setTime = () => {
        // gets US Pacific time
        const zone = "America/Los_Angeles";
        let timeHours = DateTime.now().setZone(zone).hour;
        let timeMinutes = DateTime.now().setZone(zone).minute;
        // sets 24 hours time
        this.setState({
            currentTime24: timeHours + ":" + timeMinutes
        })
        // sets user time
        this.setState({
            currentTime: this.toUserTime(timeHours, timeMinutes)
        })
    }

    // method for converting hours and minutes to user display time
    toUserTime = (hours, minutes) => {
        let ampm = "AM";
        // to convert to twelve hour pm time
        if (hours > 12) {
            hours = hours - 12;
            ampm = "PM";
        }
        // for midnight
        if (hours === 0) {
            hours = 12;
        }
        // for minutes less that 10
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        return (hours + ":" + minutes + ampm);
    }


    // method that will change background for when an order is ready
    isReadyStyle(isReady, customer, index) {
        if (customer[index] !== null) {
            // calculates time different to determine warning and late order styles
            const orderTimeHours = parseInt(customer[index].readyTime.substr(0, customer[index].readyTime.indexOf(":"))) * 60
            const orderTimeMinutes = parseInt(customer[index].readyTime.substr(customer[index].readyTime.indexOf(":") + 1, customer[index].readyTime.length - 1))
            const currentTimeHours = parseInt(this.state.currentTime24.substr(0, this.state.currentTime24.indexOf(":"))) * 60
            const currentTimeMinutes = parseInt(this.state.currentTime24.substr(this.state.currentTime24.indexOf(":") + 1, this.state.currentTime24.length - 1))

            // to calculate difference in times
            const timeDifference = (orderTimeHours + orderTimeMinutes) - (currentTimeHours + currentTimeMinutes)

            //for when true
            if (isReady) {
                return "green-background";
            }
            // for red late order
            else if (timeDifference < 0) {
                return "bg-danger"
            }
            // for yellow warning 
            else if (timeDifference <= 10) {
                return "bg-warning"
            }
            else {
                return "standard-table-orders";
            }
        }
        else {
            return "";
        }
    }

    render() {
        return (
            <>
                <RestaurantNav />
                < div className="order-div" >
                    <h4>
                        {this.state.pageTitle}
                        <span className="order-badge badge bg-danger">{this.state.count}</span>
                        <button className="btn btn-refresh btn-secondary" onClick={this.refreshPage}>Update Page</button>
                        <span>{this.state.currentTime}</span>
                    </h4>
                    <table className="table">
                        <thead>
                            <tr className="order-table-headings">
                                <th>Name</th>
                                <th>Order</th>
                                <th>Type</th>
                                <th>Time</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Notes</th>
                                <th>Ready</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.orders === null ?
                                <></> :
                                this.state.orders.map((order, index) => {
                                    return (this.populateCustomerRow(this.state.orders, index))
                                })}
                        </tbody>
                    </table>
                </ div>
            </>
        )
    }

    // method to decrement count when order is ready
    decrementCustomerCount = () => {
        this.setState({ count: this.state.count - 1 });
    }

    //method to set count when orders are initialized
    setCustomerCount = (count) => {
        this.setState({ count: count });
    }

    //method to mark an order ready
    markReady = (customer, index) => {
        this.decrementCustomerCount();
        customer[index].isReady = true;
        //repopulates the customer row with changes
        this.populateCustomerRow(customer, index);
    }

    // to increment customoer count
    incrementCustomerCount = () => {
        this.setState({
            count: this.state.count + 1
        })
    }

    //method to mark an order as pending
    markPending = (customer, index) => {
        this.incrementCustomerCount();
        customer[index].isReady = false;
        //repopulates the customer row with changes
        this.populateCustomerRow(customer, index);
    }

    //deletes customer from customers array
    deleteCustomer = (customer, index) => {
        // deletes the customer from database
        const id = customer[index].id
        fetch(`http://localhost:5000/orders/${id}`,
            { method: "DELETE" }
        )
        //removes customer
        customer.splice(index, 1);
        //resets the state to load new deleted customers
        this.setState({ customers: this.state.customers });
    }

    // method to generate order list
    orderList = (customer, index) => {
        // grabs the order object of the state at index
        const ordersArray = customer[index].orderInfo[0].fromCart;
        return (
            <ul className="order-list">
                {ordersArray.map((order) => {
                    return (<li className="order-list-item" key={order.id}>{this.orderItem(order)}</li>)
                })}
            </ul>
        )
    }

    // method to generate a list of notes
    notesList = (customer, index) => {
        // grabs the order object of the state at index
        const ordersArray = customer[index].orderInfo[0].fromCart;
        return (
            <ul className="order-list">
                {ordersArray.map((order) => {
                    return (this.noteItem(order))
                })}
            </ul>
        )
    }

    noteItem = (order) => {
        if (order.notes === "") {
            return (<></>)
        }
        else {
            return (
                <li className="order-list-item" key={order.id}>{order.name + ": " + order.notes}</li>
            )
        }
    }

    // method to generate ordered item
    orderItem = (order) => {
        return (
            <>
                <strong>{order.quantity
                    + "x "
                    + order.name
                }</strong>
                {this.toppingsList(order)}
            </>)
    }

    // method to generate toppings list
    toppingsList = (order) => {
        const toppings = order.toppings;
        return (
            <ul>
                {toppings.map((topping, index) => {
                    return (<li key={index}>{this.toppingItem(topping)}</li>)
                })}
            </ul>
        )
    }


    // method to generate topping
    toppingItem = (topping) => {
        return (
            topping
        )
    }

    // method to generate address
    generateAddress = (customer, index) => {
        if (this.pickupOrDelivery(customer, index) === "Delivery") {
            return (`${customer[index].street}, ${customer[index].city}, ${customer[index].USstate}, ${customer[index].zip}`)
        }
        else {
            return (` - `)
        }
    }

    // method to populate a row of customers
    populateCustomerRow = (customer, index) => {
        if (customer === null | this.state.currentTime24 === null) {
            return (<tr key={index}><td></td></tr>);
        }
        else {
            return (
                // populates the table of customers with green background if the order is ready
                <tr key={index} className={this.isReadyStyle(customer[index].isReady, customer, index)}>
                    <td>{customer[index].fName + " " + customer[index].lName[0].toUpperCase()}</td>
                    <td>{this.orderList(customer, index)}</td>
                    <td>{this.pickupOrDelivery(customer, index)}</td>
                    <td>{customer[index].userReadyTime}</td>
                    <td>{customer[index].phone}</td>
                    <td>{this.generateAddress(customer, index)}</td>
                    <td>{this.notesList(customer, index)}</td>
                    <td>
                        {/* checks to see is order is ready and changes button and method */}
                        {customer[index].isReady === false
                            ? <button className="btn btn-success" onClick={() => { this.markReady(customer, index); }}>Ready</button>
                            : <div><button className="btn btn-danger" onClick={() => { this.markPending(customer, index); }}>Undo</button><button className="btn btn-primary" onClick={() => { this.deleteCustomer(customer, index); }}>Done</button></div>}
                    </td>
                </tr>
            )
        }
    }

    // method to determine if order is delivery or pickup
    pickupOrDelivery = (customer, index) => {
        const fee = customer[index].orderInfo[0].fees;
        if (fee === 8) {
            return ("Delivery")
        }
        else {
            return ("Pick-up")
        }
    }

    // to pull data from database to state
    componentDidMount = async () => {
        // get request from database server
        let response = await fetch("http://localhost:5000/Orders", { method: "GET" })
        // converts the json data to js array
        let orders = await response.json();
        // sets the state to fetched values
        this.setState({ orders: orders });
        // sets the count
        this.setCustomerCount(this.state.orders.length)
        // sets time
        this.setTime();
    }
}

export default Orders;