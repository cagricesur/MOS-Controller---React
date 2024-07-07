import React from "react";
import { useParams } from "react-router-dom";

const NewState = React.lazy(() => import("./_new"));
const StateList = React.lazy(() => import("./_list"));
const ViewState = React.lazy(() => import("./_view"));

const State: React.FunctionComponent = () => {
  const { id } = useParams();
  return (
    <>{id ? id === "new" ? <NewState /> : <ViewState /> : <StateList />}</>
  );
};
export default State;
