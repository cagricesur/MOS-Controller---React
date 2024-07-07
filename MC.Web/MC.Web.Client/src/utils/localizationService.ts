import axios from "axios";
import i18n, { ResourceKey } from "i18next";
import { initReactI18next } from "react-i18next";

import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend, {
  HttpBackendOptions,
  RequestResponse,
} from "i18next-http-backend";
import {
  AddResourceRequest,
  AddResourceResponse,
  GetResourcesRequest,
  GetResourcesResponse,
} from "../models";

const AddResourceAction = "AddResource";
const GetResourcesAction = "GetResources";

function call<ResourceResponse>(
  action: string,
  request: AddResourceRequest | GetResourcesRequest,
  dataSelector: (response: ResourceResponse) => ResourceKey,
  callback: (error: unknown, response: RequestResponse) => void
) {
  axios
    .post<ResourceResponse>(`/api/app/${action}`, request)
    .then((response) => {
      callback(null, {
        status: 200,
        data: dataSelector(response.data),
      });
    })
    .catch((error) => {
      callback(error, { status: error?.response?.status || 500, data: {} });
    });
}

function addResource(
  language: string,
  payload: Record<string, string>,
  callback: (error: unknown, response: RequestResponse) => void
) {
  const request = {
    language,
  } as AddResourceRequest;
  Object.entries(payload).forEach((kvp) => {
    request.key = kvp[0];
    request.value = `${language}_${kvp[1]}`;
  });
  call<AddResourceResponse>(
    AddResourceAction,
    request,
    (response) => response,
    callback
  );
}
function getResources(
  language: string,
  callback: (error: unknown, response: RequestResponse) => void
) {
  call<GetResourcesResponse>(
    GetResourcesAction,
    { language } as GetResourcesRequest,
    (response) => response.resources,
    callback
  );
}

const backend: HttpBackendOptions = {
  addPath: `${AddResourceAction}|{{lng}}|{{ns}}`,
  loadPath: `${GetResourcesAction}|{{lng}}|{{ns}}`,
  request: (_options, url, _payload, callback) => {
    const parameters = url.split("|");
    const action = parameters[0];
    const language = parameters[1];
    if (action === AddResourceAction) {
      addResource(language, _payload as Record<string, string>, callback);
    } else if (action === GetResourcesAction) {
      getResources(language, callback);
    } else {
      throw "BackEndRequestError";
    }
  },
};

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  .use(HttpBackend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init<HttpBackendOptions>({
    fallbackLng: "en",
    supportedLngs: ["en", "tr"],
    preload: ["en"],
    debug: true,
    saveMissing: true,
    saveMissingTo: "all",
    backend,
  });

export default i18n;
