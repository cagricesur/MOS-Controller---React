import { message } from "antd";
import { useEffect } from "react";
import { useAppStore } from "../utils";

message.config({
  duration: 3,
  maxCount: 1,
  top: 64,
});

export const HttpMessage: React.FunctionComponent = () => {
  useEffect(() => {
    const unsub = useAppStore.subscribe((state) => {
      if (state.httpFailureMessage) {
        message.error(state.httpFailureMessage);
        useAppStore.setState({ httpFailureMessage: undefined });
      } else if (state.httpSuccessMessage) {
        message.success(state.httpSuccessMessage);
        useAppStore.setState({ httpSuccessMessage: undefined });
      }
    });
    return () => {
      unsub && unsub();
    };
  }, []);
  return <></>;
};
