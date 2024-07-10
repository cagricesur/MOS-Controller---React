import React from "react";
import { useParams } from "react-router-dom";
import { isGuid } from "../../utils";

const NewState = React.lazy(() => import("./new"));
const StateList = React.lazy(() => import("./_list"));
const ViewState = React.lazy(() => import("./view"));

const State: React.FunctionComponent = () => {
  const { id } = useParams();

  if (id) {
    if (isGuid(id)) {
      return <ViewState />;
    } else {
      return <NewState />;
    }
  } else {
    return <StateList />;
  }
};
export default State;
