import { Filter, QueryParams } from "./types";

export enum QueryKeys {
  FILTER = "filter=",
  SORT_ORDER = "sortOrder=",
  SORT_BY = "sortBy=",
  TOP = "count=",
  SKIP = "startIndex=",
}

export const USER_URI = "/Users";
export const GROUP_URI = "/Groups";
export const MEMBER_URI = "/members";

export function constructUserListQuery(params?: QueryParams): string {
  if (!params) {
    return USER_URI;
  }
  return constructQueryFromParams(USER_URI, params);
}

export function constructUserQuery(id: string): string {
  return `${USER_URI}/${id}`;
}

export function constructGroupListQuery(params?: QueryParams): string {
  if (!params) {
    return GROUP_URI;
  }
  return constructQueryFromParams(GROUP_URI, params);
}

export function constructGroupQuery(id: string): string {
  return `${GROUP_URI}/${id}`;
}

export function constructGroupMemberListQuery(group: string): string {
  return `${GROUP_URI}/${group}${MEMBER_URI}`;
}

export function constructGroupMemberQuery(group: string, user: string): string {
  return `${GROUP_URI}/${group}${MEMBER_URI}/${user}`;
}

export function constructQueryFromParams(
  baseUri: string,
  params: QueryParams
): string {
  let paramsAdded = false;
  let query = `${baseUri}?`;

  if (params.top) {
    query += `${QueryKeys.TOP}${params.top}`;
    paramsAdded = true;
  }

  if (params.skip) {
    query += `${paramsAdded ? "&" : ""}${QueryKeys.SKIP}${params.skip}`;
    paramsAdded = true;
  }

  if (params.sortOrder) {
    query += `${paramsAdded ? "&" : ""}${QueryKeys.SORT_ORDER}${
      params.sortOrder
    }`;
    paramsAdded = true;
  }

  if (params.sortBy) {
    query += `${paramsAdded ? "&" : ""}${QueryKeys.SORT_BY}${params.sortBy}`;
    paramsAdded = true;
  }

  if (params.filter) {
    const filter = constructFilterString(params.filter);
    query += `${paramsAdded ? "&" : ""}${filter}`;
  }

  return query;
}

export function constructFilterString(filters: Filter[]): string {
  const mappedFilters = filters.map(
    (el) => `${el.property} ${el.operator} ${formatFilterValue(el.value)}`
  );
  return `${QueryKeys.FILTER}${mappedFilters.join(`&${QueryKeys.FILTER}`)}`;
}

function formatFilterValue(value: string | number | boolean): string {
  switch (typeof value) {
    case "string":
      return `'${value}'`;
    case "number":
      return `${value}`;
    case "boolean":
      return `${value}`;
    default:
      throw new Error("Invalid filter value type provided!");
  }
}
