import { LoaderFunctionArgs } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { isGuid } from ".";
import {
  GetConfigsResponse,
  GetStateRequest,
  GetStateResponse,
  ListUsersRequest,
  ListUsersResponse,
  StateRowExtended,
  StateRowExtendedContainer,
} from "../models";
import { HttpService } from "./httpService";

export const fetchStateData = async (args: LoaderFunctionArgs) => {
  const { id } = args.params;

  if (id) {
    if (isGuid(id)) {
      const request: GetStateRequest = {
        id: id,
      };
      const response = await HttpService.post<GetStateResponse>(
        "/api/state/get",
        request
      );
      return response.data;
    } else if (id === "100-999") {
      const container: StateRowExtendedContainer = {
        rows: new Array(9).fill(0).map((_n, index) => {
          const start = (index + 1) * 100;
          const end = start + 99;
          return {
            id: uuidv4(),
            codeStart: start,
            codeEnd: end,
            max: end,
            enabled: index === 0,
          } as StateRowExtended;
        }),
        date: new Date(),
      };
      return container;
    } else if (id === "010-049") {
      return {
        rows: [
          {
            id: uuidv4(),
            codeStart: 10,
            codeEnd: 49,
            max: 49,
            enabled: true,
          } as StateRowExtended,
        ],
        date: new Date(),
      } as StateRowExtendedContainer;
    } else if (id === "050-099") {
      return {
        rows: [
          {
            id: uuidv4(),
            codeStart: 50,
            codeEnd: 99,
            max: 99,
            enabled: true,
          } as StateRowExtended,
        ],
        date: new Date(),
      } as StateRowExtendedContainer;
    }
  }
  return null;
};
export const fetchUsers = async () => {
  const request: ListUsersRequest = {};
  const response = await HttpService.post<ListUsersResponse>(
    "/api/user/list",
    request
  );
  return response.data;
};
export const fetchConfigs = async () => {
  const response = await HttpService.get<GetConfigsResponse>(
    "/api/app/getconfigs"
  );
  return response.data;
};
