import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { DataPage } from "./Pages/DataPage";
import { FormPage } from "./Pages/FormPage";

export const Routes = () => {
  const RedirectToHome = () => <Redirect to={`/`} />;

  return (
    <Router>
      <Route>
        <Switch>
          <Route exact path={"/"} component={FormPage} />
          <Route exact path={"/data"} component={DataPage} />
          <Route exact component={RedirectToHome} />
        </Switch>
      </Route>
    </Router>
  );
};
