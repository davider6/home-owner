import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { PROPS } from "../../constants/properties";
import { RequestFields } from "../../model/bo/RequestFields";
import { Storage } from "@ionic/storage";
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from "../../services/auth.service";
import { Environment } from "@capacitor/google-maps";

@Injectable({
  providedIn: "root",
})
export class BackendService {
  constructor(
    private http: HttpClient,
    private storage: Storage,
    private afAuth: AngularFireAuth,
    private authService: AuthService
  ) {}

  headersWithoutToken = new HttpHeaders({ "Content-Type": "application/json" });

  public userExists(id, type, entity = "C") {
    const headersObj = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.get(
      PROPS.baseUrl +
        `externalExists?externalId=${id}&type=${type}&entity=${entity}`,
      { headers: headersObj }
    );
  }

  public postInternalUser(user) {
    const headersObj = new HttpHeaders({
      "Content-Type": "application/json",
    });

    const internalUser = {
      address: user.address,
      clientPassword: user.password ? user.password : null,
      email: user.email,
      externalId: user.tokenKey ? user.tokenKey : null,
      fullName: user.name,
      gender: null,
      id: null,
      idNumber: null,
      idType: null,
      latitude: user.latitude,
      longitude: user.longitude,
      profileImage: null,
      status: user.status,
      telephoneNumber: null,
      type: user.type,
      zipCode: user.zipCode,
    };

    return this.http.post(
      PROPS.baseUrl + "backend-services/clients",
      JSON.stringify(internalUser),
      { headers: headersObj }
    );
  }

  public postExternalUser(user, tokenKey, tokenProvider, entity = "C") {
    const headersObj = new HttpHeaders({
      "Content-Type": "application/json",
    });
    const externalUser = {
      address: user.address,
      clientPassword: null,
      email: user.email ? user.email : null,
      externalId: tokenKey, //TokenOauth sin Facebook|
      fullName: user.name ? user.name : null,
      gender: null,
      id: null,
      idNumber: null,
      idType: null,
      latitude: user.latitude,
      longitude: user.longitude,
      profileImage: user.picture ? user.picture : null,
      status: true,
      telephoneNumber: null,
      type: tokenProvider,
      zipCode: user.zipCode,
      entity: entity,
    };

    return this.http.post(
      PROPS.baseUrl + "backend-services/clients",
      JSON.stringify(externalUser),
      { headers: headersObj }
    );
  }

  public getAuthToken(user) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(PROPS.baseUrl + "auth", JSON.stringify(user), {
      headers: headers,
    });
  }

  public getUserById(token, id) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token,
    });
    return this.http.get(PROPS.baseUrl + `backend-services/clients/${id}`, {
      headers: headers,
    });
  }

  userLogin(user: string, pass: string, loginType: string) {
    const headersObj = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(
      PROPS.baseUrl + "auth",
      { username: user, password: pass, type: loginType },
      { headers: headersObj }
    );
  }

  public getEntityDetailByIdAndToken(
    entity: string,
    id: number,
    token: string
  ) {
    const headersObj = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token,
    });
    return this.http.get(PROPS.backendUrl + entity + "/" + id, {
      headers: headersObj,
    });
  }

  public getAllFromEntity(entity: string, token: string) {
    const headersObj = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token,
    });
    return this.http.get(PROPS.backendUrl + entity, { headers: headersObj });
  }

  public getEntityDetailById(entity: string, id: number, token: string) {
    const headersObj = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token,
    });
    return this.http.get(PROPS.backendUrl + entity + "/" + id, {
      headers: headersObj,
    });
  }

  public insertEntity(entity: string, object: any, token: string) {
    const headersObj = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token,
    });
    return this.http.post(PROPS.backendUrl + entity, JSON.stringify(object), {
      headers: headersObj,
    });
  }

  public deleteEntity(entity: string, id: number, token: string) {
    const headersObj = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token,
    });
    return this.http.delete(PROPS.backendUrl + entity + "/" + id, {
      headers: headersObj,
    });
  }

  public updateEntity(entity: string, id: number, object: any, token: string) {
    const headersObj = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token,
    });
    return this.http.put(
      PROPS.backendUrl + entity + "/" + id,
      JSON.stringify(object),
      { headers: headersObj }
    );
  }

  public getItemsByMethod(
    entity: string,
    method: string,
    fields: RequestFields[],
    token: string
  ) {
    const headersLoc = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token,
    });

    let urlFields = "";
    let first = true;
    if (fields && fields.length > 0) {
      for (const field of fields) {
        if (first) {
          urlFields = field.fieldName + "=" + field.fieldValue;
          first = false;
        } else {
          urlFields += "&" + field.fieldName + "=" + field.fieldValue;
        }
      }
    }
    let url = PROPS.backendUrl + entity + "/" + method;
    if (urlFields !== "") {
      url = url + "?" + urlFields;
    }
    console.log(url);
    return this.http.get(url, { headers: headersLoc });
  }

  public getItemsByMethodCache(
    method: string,
    fields: RequestFields[],
    token: string
  ) {
    const headersLoc = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token,
    });

    let urlFields = "";
    let first = true;
    if (fields && fields.length > 0) {
      for (const field of fields) {
        if (first) {
          urlFields = field.fieldName + "=" + field.fieldValue;
          first = false;
        } else {
          urlFields += "&" + field.fieldName + "=" + field.fieldValue;
        }
      }
    }
    let url = PROPS.backendCacheUrl + "/" + method;
    if (urlFields !== "") {
      url = url + "?" + urlFields;
    }
    return this.http.get(url, { headers: headersLoc });
  }

  public getItemsByMethodPaginated(
    entity: string,
    method: string,
    token: string,
    fields: RequestFields[],
    pageSize: number,
    pageNumber: number
  ) {
    const headersObj = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token,
    });
    let URi = PROPS.backendUrl + entity + "/" + method + "?";
    let urlFields = "";
    let first = true;
    if (fields && fields.length > 0) {
      for (const field of fields) {
        if (first) {
          urlFields = field.fieldName + "=" + field.fieldValue;
          first = false;
        } else {
          urlFields += "&" + field.fieldName + "=" + field.fieldValue;
        }
      }
      URi += urlFields + "&page=" + pageNumber + "&size=" + pageSize;
    } else {
      URi += "page=" + pageNumber + "&size=" + pageSize;
    }
    return this.http.get(URi, { headers: headersObj, observe: "response" });
  }

  public getEvent(entity: string, token: string) {
    let headersToken = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token,
    });

    return this.http.get(`${PROPS.backendUrl}${entity}`, {
      headers: headersToken,
    });
  }

  public postEvent(bodyParam: any, entity: string) {
    return this.http.post(
      `${PROPS.baseUrl}${entity}`,
      JSON.stringify(bodyParam),
      { headers: this.headersWithoutToken }
    );
  }

  public postEventWithToken(bodyParam: any, entity: string, token: string) {
    let headersToken = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token,
    });

    return this.http.post(
      `${PROPS.backendUrl}/${entity}`,
      JSON.stringify(bodyParam),
      { headers: headersToken }
    );
  }

  public putEventWithToken(bodyParam: any, entity: string, token: string) {
    let headersToken = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token,
    });

    return this.http.put(
      `${PROPS.backendUrl}/${entity}`,
      JSON.stringify(bodyParam),
      { headers: headersToken }
    );
  }

  public externalExists(externalId: string, type: string) {
    return this.http.get(
      `${PROPS.baseUrl}externalExists?entity=C&externalId=${externalId}&type=${type}`,
      { headers: this.headersWithoutToken }
    );
  }

  public writeLog(logstr: string) {
    const urlStr = `${PROPS.baseUrl}write-log?logstring=${logstr}`;
    console.log(urlStr);
    return this.http.get(urlStr, {
      headers: this.headersWithoutToken,
    });
  }

  public internalExists(
    username: string,
    password: string,
    type: string,
    device: string
  ) {
    let bodyParam = {
      entity: "C",
      password,
      type,
      username,
      device,
    };

    return this.http.post(`${PROPS.baseUrl}auth`, JSON.stringify(bodyParam), {
      headers: this.headersWithoutToken,
    });
  }

  cleanStorage() {
    // this.storage.clear();
    this.storage.remove("auth-token");
    this.storage.remove("userId");
    this.storage.remove("workerObject");
    this.authService.usuario = {};
    // console.log('storage cleaned');
  }

  saveStorage(key: string, value: string) {
    this.storage.set(key, value);

    if (key === "userId" || key === "auth-token") {
      sessionStorage.setItem(key, value);
    }
  }

  signOut() {
    this.afAuth.auth
      .signOut()
      .then((resp) => {
        console.log("succefully signout", resp);
        this.cleanStorage();
      })
      .catch((err) => {
        console.log("error signing out", err);
      });
  }

  getGeocodingInfo(coordinates) {
    const urlStr = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates}&key=${PROPS.googleMapsApiKey}`;

    return this.http.get(urlStr);
  }

  public getItemsByMethodWithoutContext(
    entity: string,
    method: string,
    fields: RequestFields[],
    token: string
  ) {
    const headersLoc = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token,
    });

    let urlFields = "";
    let first = true;
    if (fields && fields.length > 0) {
      for (const field of fields) {
        if (first) {
          urlFields = field.fieldName + "=" + field.fieldValue;
          first = false;
        } else {
          urlFields += "&" + field.fieldName + "=" + field.fieldValue;
        }
      }
    }
    let url = "";
    if (method != "") {
      url = PROPS.baseUrl + "/" + entity + "/" + method;
    } else {
      url = PROPS.baseUrl + "" + entity;
    }

    if (urlFields !== "") {
      url = url + "?" + urlFields;
    }

    // console.log('Consumiendo',url);

    return this.http.get(url, { headers: headersLoc });
  }
}
