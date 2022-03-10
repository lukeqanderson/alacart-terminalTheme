import { Component } from "react";

//component for a single product
class MenuItem extends Component {

    //adds the props to state so they can be changed
    state = {
        item: this.props.item,
        //stores an item to send to cart
        toCart: {

            id: this.props.item.id,
            image: this.props.item.image,
            name: this.props.item.name,
            description: this.props.item.description,
            size: "",
            // second value in toppings is the key
            toppings: [],
            price: this.props.item.price,
            quantity: 0,
            notes: ""
        },
        cartItem: [],
        message: "Item added to cart!"
    };

    render() {
        return (
            //supplies all properties from parent element "Cart"
            //as props
            <div className="card item-card">
                <img src={this.state.item.image} className="card-img-top item-image" alt={this.state.item.name} />
                <div className="card-body">
                    <div className="title-price-div">
                        <h5 className="card-title">{this.state.item.name}
                            <span className="item-price">${this.state.item.price}</span></h5>
                        <p>{this.state.item.description}</p>
                    </div>
                    {/* form for user inputs from menu */}
                    <form>

                        <div className="form-group">
                            <label
                                className="quantity-label"
                                htmlFor="quantity-input">Quantity
                            </label>
                            <input
                                type="number"
                                className="menu-input form-control"
                                id="quantity-input"
                                min="0"
                                max="50"
                                placeholder="Enter the amount..."
                                value={this.state.quantity}
                                // method to update quantity on change
                                onChange={this.updateQuantity}
                            />
                            <select className="menu-input size-select form-select" aria-label="Default select example" onChange={this.updateSize}>
                                <option>Pick a size...</option>
                                {/* loops the array to return the sizes */}
                                {this.state.item.size.map((size) => {
                                    // if statement to display addition information and added price
                                    return (size[3] | size[3] === 0
                                        ? <option key={size[1]} value={size}>
                                            {size[0]} ({size[2]}) + ${size[3]}
                                        </option>
                                        : <option key={size[1]} value={size}>
                                            {size[0]}
                                            + ${size[2]}
                                        </option>)
                                })}
                            </select>
                        </div>
                        {/* loops the array to return toppings */}
                        {this.state.item.toppings.map((topping) => {
                            //renders the toppings in checkbox form
                            return (
                                <div key={topping[1]} className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        className="menu-input form-check-input"
                                        id="add-on"
                                        // sets value to the toppings array
                                        value={topping}
                                        onChange={this.updateToppings}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="add-on">
                                        Add {topping[0]} ${topping[2].toFixed(2)}
                                    </label>
                                </div>
                            );
                        })}
                        <div className="mb-3">
                            <label htmlFor="notes" className="form-label">Notes</label>
                            <textarea className="menu-input form-control" onChange={this.updateNotes} rows="3"></textarea>
                        </div>
                        <div className="add-to-cart-btn-div">
                            <button type="button" className="add-to-cart-btn btn btn-secondary" onClick={this.addItems}>Add to Cart</button>
                        </div>
                    </form>
                </div >
            </div >
        )
    }

    // method to update quantity state in toCart on change
    updateQuantity = (event) => {
        this.setState(
            {
                toCart: {
                    ...this.state.toCart,
                    quantity: event.target.value
                }
            }
        )
    }

    // method to update notes on change
    updateNotes = (event) => {
        // add toppings name to the state
        this.setState(
            {
                toCart: {
                    ...this.state.toCart,
                    notes: event.target.value
                }
            }
        )
    }

    // method to update toppings on change
    updateToppings = (event) => {
        // add toppings name to the state
        this.setState({
            cartItem: this.state.cartItem.concat(event.target.value.substr(0, event.target.value.indexOf(",")))
        })
    }

    // generate unique id using returned date in miliseconds
    generateUniqueId = () => {
        // sets state to unique id
        this.setState({
            toCart: {
                ...this.state.toCart,
                id: Date.now
            }
        }, this.sendItems)
    }

    // method to update size state in toCart on change
    updateSize = (event) => {
        // sets cart to value of size selected
        this.setState(
            {
                toCart: {
                    ...this.state.toCart,
                    size: event.target.value
                }
            }
        )
    }

    // method to determine if toppings is selected or not and return them
    returnSelectedToppings = () => {
        if (this.state.cartItem.length === 0) {
            return this.state.cartItem;
        }
        else {
            //return the toppings with no duplicates
            let toppingsNoDuplicate = [...new Set(this.state.cartItem)];
            // for loops to counts array items and remove item with a count dividable by 2
            for (let i = 0; i < toppingsNoDuplicate.length; i++) {
                let toppingCount = 0;
                for (let u = 0; u < this.state.cartItem.length; u++) {
                    if (toppingsNoDuplicate[i] === this.state.cartItem[u]) {
                        toppingCount++;
                    }
                }
                // checks for even number of toppings (duplicate)
                if (toppingCount % 2 === 0) {
                    toppingsNoDuplicate.splice(i, i + 1);
                }
            }
            return toppingsNoDuplicate;
        }
    }

    //method to send items to database
    sendItems = () => {

        fetch('http://localhost:5000/Cart', {
            method: 'POST',
            headers: {
                'Accepts': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.toCart)
        })
    }

    // method to add items to state
    addItems = () => {
        // checks for quantity of 0
        if (parseInt(this.state.toCart.quantity) === 0) {
            alert("Quantity must be at least 1. Please adjust quantity and try again.");
        }
        // checks for no size selected
        else if (this.state.toCart.size === "") {
            alert("Please select a size to add item to cart.")
        }
        else {
            let newToppings = this.returnSelectedToppings();
            this.setState({
                toCart: {
                    ...this.state.toCart,
                    toppings: newToppings
                }
            }, this.generateUniqueId)
            alert(`${this.state.toCart.name} (x${this.state.toCart.quantity}) added to your cart`);
        }
    }

}
export default MenuItem;