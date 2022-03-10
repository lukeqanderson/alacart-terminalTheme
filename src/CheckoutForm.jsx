import { Component } from "react";
import NavBar from "./Nav";
import { Link } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import { DateTime } from "luxon";
// imports email js for confirmation emails
import emailjs from "emailjs-com"

class CheckoutForm extends Component {
    state = {
        orderInfo: [],
        totalPrice: 0,
        fName: "",
        mName: "",
        lName: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        USstate: "OR",
        zip: "",
        submitForm: null,
        orderTime: null,
        readyTime: null,
        userOrderTime: null,
        userReadyTime: null,
        isReady: false,
        pickupOrDelivery: null
    }

    render() {
        return (
            <>
                <NavBar />
                {/* if statement to thank them for purchasing on empty state */}
                {this.state.totalPrice === 0 ?

                    <div>
                        <h2 className="thanks-message">Thank You. Enjoy your meal!</h2>
                        <Link className="btn nav-link active" to="/Menu"><button className="btn btn-secondary" type="button">Return to Menu</button></Link>
                    </div>

                    : <div className="checkout-form-div">
                        <h4>Customer Details</h4>
                        <br></br>
                        <form className="row g-3 needs-validation">
                            <div className="col-md-4">
                                <label className="form-label">First name</label>
                                <input
                                    type="text"
                                    className="form-control checkout-input"
                                    placeholder="John"
                                    onChange={this.setFName}
                                    required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Middle name</label>
                                <input
                                    type="text"
                                    className="form-control checkout-input"
                                    placeholder="(optional)"
                                    onChange={this.setMName}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Last name</label>
                                <input
                                    type="text"
                                    className="form-control checkout-input"
                                    placeholder="Doe"
                                    onChange={this.setLName}
                                    required />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Email address</label>
                                <input
                                    type="email"
                                    className="form-control checkout-input"
                                    placeholder="name@example.com"
                                    onChange={this.setEmail}
                                    required />
                            </div>
                            <div className="col-md-12">
                                <label className="phone-input">Phone number:</label>
                                <input
                                    className="form-control checkout-input"
                                    placeholder="999-999-9999"
                                    type="tel"
                                    onChange={this.setPhone}
                                    required
                                />
                            </div>
                            {this.formOnDelivery()}
                            <div className="col-12">
                                <span>Do you agree to allow A la Cart to charge your card for $</span>
                                <span>{this.state.totalPrice === 0 ? "loading..." : this.state.totalPrice}</span>
                                <span>?</span>
                            </div>
                            <div className="col-12">
                                {this.state.submitForm}
                                <Link className="btn nav-link active" to="/cart" onClick={this.deleteCheckout}><button className="btn btn-danger" type="button">Return to Cart</button></Link>
                            </div>
                        </form>
                    </div>}
            </>
        )
    }

    // method to send customer email
    sendEmail = () => {
        // method to send email to customer
        emailjs.send("service_6trpmey", "template_7pmqr5k", this.state, "kCkuM4hdkq4B6Y3Bl")
            .then(() => {
                // logs success
                console.log("email sent successfully")
                // logs error
            }, (err) => {
                console.log(JSON.stringify(err))
            })

        // method to send email to restaurant
        emailjs.send("service_6trpmey", "template_5cv15io", this.state, "kCkuM4hdkq4B6Y3Bl")
            .then(() => {
                // logs success
                console.log("email sent successfully")
                // logs error
            }, (err) => {
                console.log(JSON.stringify(err))
            })
    }

    // method to validate form
    validateForm = () => {
        // if statements to validate form components
        if (this.state.fName === "") {
            alert("Please enter your first name")
        }
        else if (this.state.lName === "") {
            alert("Please enter your last name")
        }
        else if (!(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(this.state.email))) {
            alert("Please enter a valid email in the format name@example.com")
        }
        else if (!(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(this.state.phone))) {
            alert("Please enter your phone number in the format XXX-XXX-XXXX, (XXX) XXX-XXXX, or XXXXXXXXXX.\n\nPlease note that at this time we only accept US phone numbers.")
        }
        // to check for not loaded state
        else if (this.state.totalPrice === null) {
            alert("Please wait to total price to display before agreeing. If it fails to load please go back to cart and try again.")
        }
        // checks for delivery
        else if (this.state.orderInfo[0].fees === 8) {
            if (this.state.street === "") {
                alert("Please enter your street address")
            }
            else if (this.state.city === "") {
                alert("Please enter your city")
            }
            else if (this.state.city.toLowerCase() !== "la grande") {
                alert("This restaurant is only available for delivery in La Grande, Oregon.\n\nPlease change you city to 'La Grande' or choose the pickup order option instead.")
            }
            else if (this.state.USstate !== "OR") {
                alert("This restaurant is only available for delivery in La Grande, Oregon.\n\nPlease change your state to 'OR' or choose the pickup order option instead.")
            }
            else if (this.state.zip === "") {
                alert("Please enter your zip")
            }
            else if (!(/^(\d{5})?$/.test(this.state.zip))) {
                alert("Please enter 5 number for your zip in the form XXXXX.");
            }
            // checks for La Grande zipcodes
            else if (this.state.zip !== "97850") {
                alert("This restaurant only delivers to the zip '97850'.\n\nPlease check your zip or change order to the pickup option.")
            }
            else {
                this.setState({
                    submitForm: <StripeCheckout
                        stripeKey={process.env.REACT_APP_PUBLIC_KEY}
                        token={this.makePayment}
                        name="Payment"
                        amount={(this.state.totalPrice * 100).toFixed(2)}
                    >
                        <button
                            className="btn btn-success"
                            type="button">Pay with Card</button>
                    </StripeCheckout>
                })
            }
        }
        else {
            this.setState({
                submitForm: <StripeCheckout
                    stripeKey={process.env.REACT_APP_PUBLIC_KEY}
                    token={this.makePayment}
                    name="Payment"
                    amount={(this.state.totalPrice * 100).toFixed(2)}
                >
                    <button
                        className="btn btn-success"
                        type="button">Pay with Card</button>
                </StripeCheckout>
            })
        }
    }

    // to set first name
    setFName = (event) => {
        this.setState({
            fName: event.target.value
        })
    }

    // to set middle name
    setMName = (event) => {
        this.setState({
            mName: event.target.value
        })
    }

    // to set last name
    setLName = (event) => {
        this.setState({
            lName: event.target.value
        })
    }

    // to set email
    setEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    // to set phone number
    setPhone = (event) => {
        this.setState({
            phone: event.target.value
        })
    }

    // to create token
    makePayment = token => {
        let pickupOrDelivery = "";
        if (this.state.orderInfo[0].fees === 8) {
            pickupOrDelivery = "delivered";
            // sets state for use in email
            this.setState({
                pickupOrDelivery: "delivery"
            })
        }
        else {
            pickupOrDelivery = "ready for pickup"
            // sets state for use in email
            this.setState({
                pickupOrDelivery: "pickup"
            })
        }

        const body = {
            token,
            price: this.state.totalPrice.toFixed(2)
        }
        const headers = {
            "Content-Type": "application/json"
        }

        // makes request to the backend
        return fetch(`http://localhost:8000/payment`, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        })
            .then(this.setOrderTime())
            .then(this.setReadyTime())
            .then(this.sendToDB())
            .then(this.sendEmail())
            .then(this.deleteCart())
            .then(fetch(`http://localhost:5000/Checkout/1`,
                { method: "DELETE" }
            ))
            .then(
                alert(`Payment Successful! \n\nWe have sent a confirmation email sent to ${this.state.email}.
            \n\nYour order was placed at ${this.state.userOrderTime} and will be ${pickupOrDelivery} at ${this.state.userReadyTime}. 
            \n\nThank you for ordering with us!`))
            .then(window.location.reload(false))
            .catch(error => console.log(error))
    }

    // method to display required address for delivery
    formOnDelivery = () => {
        // to allow for state to be set
        if (this.state.orderInfo[0] === undefined) {
            return null;
        }
        else if (this.state.orderInfo[0].fees === 8) {
            return (

                <>
                    <label className="form-label">Delivery Address</label>
                    <div className="col-md-12">
                        <label className="form-label">Street</label>
                        <input
                            type="text"
                            className="form-control checkout-input"
                            placeholder="123 Hungry Street"
                            onChange={this.setStreet}
                            required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">City</label>
                        <input
                            type="text"
                            className="form-control checkout-input"
                            placeholder="La Grande"
                            onChange={this.setCity}
                            required />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">State</label>
                        <select
                            defaultValue="OR"
                            className="form-select checkout-input"
                            onChange={this.setUSState}
                            required>
                            <option value="AK">AK</option>
                            <option value="AL">AL</option>
                            <option value="AR">AR</option>
                            <option value="AZ">AZ</option>
                            <option value="CA">CA</option>
                            <option value="CO">CO</option>
                            <option value="CT">CT</option>
                            <option value="DC">DC</option>
                            <option value="DE">DE</option>
                            <option value="FL">FL</option>
                            <option value="GA">GA</option>
                            <option value="HI">HI</option>
                            <option value="IA">IA</option>
                            <option value="ID">ID</option>
                            <option value="IL">IL</option>
                            <option value="IN">IN</option>
                            <option value="KS">KS</option>
                            <option value="KY">KY</option>
                            <option value="LA">LA</option>
                            <option value="MA">MA</option>
                            <option value="MD">MD</option>
                            <option value="ME">ME</option>
                            <option value="MI">MI</option>
                            <option value="MN">MN</option>
                            <option value="MO">MO</option>
                            <option value="MS">MS</option>
                            <option value="MT">MT</option>
                            <option value="NC">NC</option>
                            <option value="ND">ND</option>
                            <option value="NE">NE</option>
                            <option value="NH">NH</option>
                            <option value="NJ">NJ</option>
                            <option value="NM">NM</option>
                            <option value="NV">NV</option>
                            <option value="NY">NY</option>
                            <option value="OH">OH</option>
                            <option value="OK">OK</option>
                            <option value="OR">OR</option>
                            <option value="PA">PA</option>
                            <option value="RI">RI</option>
                            <option value="SC">SC</option>
                            <option value="SD">SD</option>
                            <option value="TN">TN</option>
                            <option value="TX">TX</option>
                            <option value="UT">UT</option>
                            <option value="VA">VA</option>
                            <option value="VT">VT</option>
                            <option value="WA">WA</option>
                            <option value="WI">WI</option>
                            <option value="WV">WV</option>
                            <option value="WY">WY</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Zip</label>
                        <input
                            type="text"
                            placeholder="97850"
                            className="form-control checkout-input"
                            pattern="[0-9]{5}"
                            onChange={this.setZip}
                            required />
                    </div>
                </>)
        }
    }

    // to set street
    setStreet = (event) => {
        this.setState({
            street: event.target.value
        })
    }

    // to set city
    setCity = (event) => {
        this.setState({
            city: event.target.value
        })
    }

    // to set US state
    setUSState = (event) => {
        this.setState({
            USstate: event.target.value
        })
    }

    // to set zip
    setZip = (event) => {
        this.setState({
            zip: event.target.value
        })
    }

    // method to set current time
    setOrderTime = () => {
        // gets US Pacific time
        const zone = "America/Los_Angeles";
        let timeHours = DateTime.now().setZone(zone).hour;
        let timeMinutes = DateTime.now().setZone(zone).minute;
        const time = timeHours + ":" + timeMinutes;
        this.setState({
            orderTime: time
        })
        // sets user time
        this.setState({
            userOrderTime: this.toUserTime(timeHours, timeMinutes)
        })
    }

    // method to delete cart on order
    deleteCart = () => {
        for (let i = 0; i < this.state.orderInfo[0].fromCart.length; i++) {
            let id = this.state.orderInfo[0].fromCart[i].id;
            fetch(`http://localhost:5000/cart/${id}`,
                { method: "DELETE" }
            )
        }
    }

    // method to set ready time
    setReadyTime = () => {
        // Gets US Pacific time
        const zone = "America/Los_Angeles";
        let timeHours = DateTime.now().setZone(zone).hour;
        let timeMinutes = DateTime.now().setZone(zone).minute;
        // const to hold fees value
        const fees = this.state.orderInfo[0].fees;

        if (fees === 8) {
            if ((timeHours >= 12 & timeHours < 14) | (timeHours >= 18 & timeHours < 20)) {
                timeHours++;
                this.setState({
                    readyTime: timeHours + ":" + timeMinutes
                })
                // sets user ready time
                this.setState({
                    userReadyTime: this.toUserTime(timeHours, timeMinutes)
                })
            }
            else {
                // for converting minutes and hours
                if (timeMinutes + 40 >= 60) {
                    timeHours++;
                    timeMinutes = timeMinutes - 20;
                }
                else {
                    timeMinutes += 40;
                }
                this.setState({
                    readyTime: timeHours + ":" + timeMinutes
                })
                // sets user ready time
                this.setState({
                    userReadyTime: this.toUserTime(timeHours, timeMinutes)
                })
            }
        }
        else {
            if ((timeHours >= 12 & timeHours < 14) | (timeHours >= 18 & timeHours < 20)) {
                // for converting minutes and hours
                if (timeMinutes + 40 >= 60) {
                    timeHours++;
                    timeMinutes = timeMinutes - 20;
                }
                else {
                    timeMinutes += 40;
                }
                this.setState({
                    readyTime: timeHours + ":" + timeMinutes
                })
                // sets user ready time
                this.setState({
                    userReadyTime: this.toUserTime(timeHours, timeMinutes)
                })
            }
            else {
                // for converting minutes and hours
                if (timeMinutes + 20 >= 60) {
                    timeHours++;
                    timeMinutes = timeMinutes - 40;
                }
                else {
                    timeMinutes += 20;
                }
                this.setState({
                    readyTime: timeHours + ":" + timeMinutes
                })
                // sets user ready time
                this.setState({
                    userReadyTime: this.toUserTime(timeHours, timeMinutes)
                })
            }
        }
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

    // delete checkout items when returning to cart
    deleteCheckout = () => {
        fetch(`http://localhost:5000/Checkout/1`,
            { method: "DELETE" }
        )
        this.setState({
            fromCart: null
        })
    }

    calculateTotalPrice = () => {
        if (this.state.orderInfo[0] === undefined) {
            this.setState({
                totalPrice: 0
            })
        }
        else {
            let totalPrice = parseFloat(this.state.orderInfo[0].totalPrice)
                + parseFloat(this.state.orderInfo[0].fees);
            this.setState({
                totalPrice: totalPrice
            })
            return (
                totalPrice
            )
        }
    }

    // sends the checkout data to database on complete order
    sendToDB = () => {
        fetch(`http://localhost:5000/Orders`, {
            method: 'POST',
            headers: {
                'Accepts': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
    }

    // checks to see if component mounts then make HTTP requests
    componentDidMount = () => {
        // sets state to display an agree button 
        this.setState({
            submitForm: <button className="btn btn-secondary" type="button" onClick={this.validateForm}>I Agree</button>
        })
        // sets timeout to ensure post request is settled
        setTimeout(() => {
            // get request from database server
            fetch(" http://localhost:5000/checkout", { method: "GET" })
                .then(response => response.json())
                .then(data => this.setState({
                    orderInfo: data
                }))
        }, 200)
        // sets timeout on total price to ensure state is 
        setTimeout(() => {
            this.calculateTotalPrice()
            this.formOnDelivery()
        }, 300)
    }
}

export default CheckoutForm