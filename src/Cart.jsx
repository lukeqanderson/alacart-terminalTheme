import { Component } from "react";
import CartItem from "./CartItem";
import NavBar from "./Nav";
import { Link } from "react-router-dom";

class Cart extends Component {
    //Creates the menu as part of the state in base for (no add-ons)
    state = {
        menu: [],
        totalCost: 0
    }

    render() {
        // renders empty cart message when no more items
        if (this.state.menu.length === 0) {
            return (
                <>
                    <NavBar></NavBar>
                    <div class="top">
                        DROP TABLE PIZZA &lt;/&gt;
                    </div>
                    <div class="terminalhead">
                        <div id="circle1"></div>
                        <div id="circle2"></div>
                        <div id="circle3"></div>
                        <div class="terminalheadtext">
                            user@ubuntu:~
                        </div>
                        <div class="terminal">
                            <div className="cart-div">
                                <div class="ubuntu">user@ubuntu:~$ <p class="title">Cart</p></div>
                                <div>
                                    <h4 className="empty-cart-message">Cart is empty. Click on the Menu tab to add items!</h4>
                                </div>
                            </div>
                            <div class="end">
                                user@ubuntu:~$ <p class="blink"> █</p>
                            </div>
                        </div>
                    </div>

                </>
            )
        }
        else {
            return (
                // render customer navbar
                <>
                    {/* passes calculate cart total to NavBar */}
                    <NavBar></NavBar>
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
                                <div class="ubuntu">user@ubuntu:~$ <p class="title">Cart</p></div>

                                <div className="cart-div">
                                    <h4>Cart</h4>
                                    <div className="item-grid">
                                        {/* loops the array to return elements */}
                                        {this.state.menu.map((item, index) => {
                                            //renders the item as a MenuItem component and passes in props
                                            return (<CartItem
                                                key={item.id}
                                                item={item}
                                                // methods passed as props for increase and decreasing the quantity
                                                increaseQuantity={this.increaseQuantity}
                                                decreaseQuantity={this.decreaseQuantity}>
                                                {/* passes a button to the child component */}
                                                <button className="btn btn-danger" onClick={() => { this.deleteItem(index) }}>Remove</button>
                                            </CartItem>);
                                        })}
                                    </div>
                                    <div className="total-price-div">
                                        <h1>Total: ${this.calculateTotalPrice(this.state.menu)}</h1>
                                    </div>
                                    <div className="checkout-div">
                                        <Link className="nav-link active" to="/checkout"><button className="pickup-btn btn btn-secondary" >Checkout</button></Link>
                                    </div>
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
    }

    // deletes items in database
    deleteItemDB = (id) => {
        fetch(`http://localhost:5000/Cart/${id}`,
            { method: "DELETE" }
        )
    }

    // updates an item in the database by deleting then resending state
    updateItemDB = (id) => {
        this.deleteItemDB(id);
        // finds index with matching id
        let index = 0;
        for (let i = 0; i < this.state.menu.length; i++) {
            if (id === this.state.menu[i].id) {
                index = i;
            }
        }
        fetch(`http://localhost:5000/Cart`, {
            method: 'POST',
            headers: {
                'Accepts': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.menu[index])
        })
    }

    // method to delete item from the list
    deleteItem = (index) => {
        // deletes database
        this.deleteItemDB(this.state.menu[index].id);
        // removes item
        this.state.menu.splice(index, 1);
        //resets the state
        this.setState({ menu: this.state.menu });
    }

    // method to increase quantity
    increaseQuantity = (item) => {
        //if statement to limited quantity to 50
        if (item.quantity < 50) {
            //clones all items into array to faciliate changing state
            let menu = [...this.state.menu];
            // find index of the targeted item in new array
            let index = menu.indexOf(item);
            // increments new array at index
            menu[index].quantity++;
            // updates to state and db
            this.setState({ menu: menu }, this.updateItemDB(this.state.menu[index].id))
        }
    }

    // method to decrease quantity
    decreaseQuantity = (item) => {
        // if statement to only decriment if more than 1 item
        if (item.quantity > 1) {
            //clones all items into array to faciliate changing state
            let menu = [...this.state.menu];
            // find index of the targeted item in new array
            let index = menu.indexOf(item);
            // decrements new array at index
            menu[index].quantity--;
            // updates to state
            this.setState({ menu: menu }, this.updateItemDB(this.state.menu[index].id))
        }
    }

    // method to calculate total price
    calculateTotalPrice = (menu) => {
        let totalPrice = 0;
        // loops through the menu
        for (let i = 0; i < menu.length; i++) {
            totalPrice += menu[i].price * menu[i].quantity;
        }
        return totalPrice.toFixed(2);
    }

    // to pull data from database to state
    componentWillMount = async () => {
        // get request from database server
        let response = await fetch("http://localhost:5000/Cart", { method: "GET" })
        // converts the json data to js array
        let menu = await response.json();
        // sets the state to fetched values
        this.setState({ menu: menu });
    }
}

export default Cart;