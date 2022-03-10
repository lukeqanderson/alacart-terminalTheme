import { Component } from "react";

//component for a single product
class CartItem extends Component {


    render() {
        return (
            //supplies all properties from parent element "Cart"
            //as props
            <div className="card item-card">
                <img src={this.props.item.image} className="card-img-top item-image" alt={this.props.item.name} />
                <div className="card-body">
                    <div className="title-price-div">
                        <h5 className="card-title">{this.props.item.name}
                            <span className="item-price">${this.props.item.price}</span></h5>
                    </div>
                    <p className="card-text">{this.props.item.description}</p>
                    <p>Quantity <span className="item-quantity">{this.props.item.quantity}</span>
                        {/* buttons to increase and decrease quantity */}
                        <span><button className="item-plus-button btn btn-secondary" onClick={() => { this.props.decreaseQuantity(this.props.item) }}>-</button></span>
                        <span><button className="item-minus-button btn btn-secondary" onClick={() => { this.props.increaseQuantity(this.props.item) }}>+</button></span>
                    </p>
                    <p>Size: <span className="item-size">{this.props.item.size.substr(0, this.props.item.size.indexOf(","))}</span></p>
                    <p>Add-ons: <span className="item-toppings">
                        {/* returns all toppings if there are any */}
                        {this.props.item.toppings[0]
                            ? this.props.item.toppings.map((topping) => {
                                return <li key={topping[1]} className="topping-list-item">{topping}</li>
                            })
                            // retruns "None." of there are no items in the array
                            : <span> None. </span>}</span></p>
                    {/* displays notes */}
                    <p>Notes: </p>
                    <p>{this.props.item.notes}</p>
                    {/* renders the button for deleting item */}
                    <div>
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}

export default CartItem;