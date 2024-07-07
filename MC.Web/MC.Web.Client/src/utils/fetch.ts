import { LoaderFunctionArgs } from "react-router-dom";
import {
  GetConfigsResponse,
  GetStateRequest,
  GetStateResponse,
  ListUsersRequest,
  ListUsersResponse,
} from "../models";
import { HttpService } from "./httpService";

export const fetchStatedData = async (args: LoaderFunctionArgs) => {
  const { id } = args.params;
  if (id && id !== "new") {
    const request: GetStateRequest = {
      id,
    };
    const response = await HttpService.post<GetStateResponse>(
      "/api/state/get",
      request
    );
    return response.data;
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
