import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";

import Notifications from "./pages/Notifications";
import Map from "./pages/Map";
import Header from "./components/Header";

export default function Routes() {
    return (
        <>
            <BrowserRouter>
                <Header />
                <Switch>
                    <Route exact path="/" component={Notifications} />
                    <Route path="/map" exact={true} component={Map} />
                </Switch>
            </BrowserRouter>
        </>
    );
}
