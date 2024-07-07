import { useRouteError } from "react-router-dom";

const Error: React.FunctionComponent = () => {
  const error = useRouteError();

  return <div>{`${error}`}</div>;
};
export default Error;
