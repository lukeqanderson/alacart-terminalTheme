import { Component } from "react";
//import all components rendered
import Login from "./Login.jsx";

//main App to combine all components and be rendered
class App extends Component {

    render() {
        return (
            // renders login page as only page, other element are
            // setup in login component on authentication
            <Login />
        )
    }
}

export default App;