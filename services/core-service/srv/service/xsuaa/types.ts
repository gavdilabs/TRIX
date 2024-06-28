export interface XsuaaResource<T> {
  resources: T[];
  startIndex?: number;
  itemsPerPage?: number;
  totalResults?: number;
  schemas?: string[];
}

export interface XsuaaEmail {
  type: string;
  value: string;
  primary: boolean;
}

export interface XsuaaMetadata {
  attributes: string[];
  version: number;
  created: string;
  lastModified: string;
}

export interface XsuaaName {
  familyName: string;
  givenName: string;
  honorificPrefix: string;
  honorificSuffix: string;
  formatted: string;
  middleName: string;
}

export interface XsuaaApproval {
  clientId: string;
  expiresAt: string;
  lastUpdatedAt: string;
  scope: string;
  status: string;
  userId: string;
}

export interface XsuaaUser {
  meta: XsuaaMetadata;
  id: string;
  origin: string;
  externalId: string;
  userName: string;
  groups: XsuaaGroup[];
  name: XsuaaName;
  emails: XsuaaEmail[];
  approvals: XsuaaApproval[];
  active: boolean;
  verified: boolean;
  zoneId: string;
  displayName: string;
  locale: string;
  nickName: string;
  passwordLastModified: string;
  previousLogonTime: string;
  lastLogonTime: string;
  schemas: string[];
  phoneNumbers: { value: string }[];
  preferredLanguage: string;
  profileUrl: string;
  salt: string;
  timezone: string;
  title: string;
  userType: string;
}

export type XsuaaUserList = XsuaaUser[];

export interface XsuaaGroup {
  displayName: string;
  value: string;
  type: string;
}

export type XsuaaGroupList = XsuaaGroup[];

export interface XsuaaGroupMember {
  origin: string;
  type: string;
  value: string;
}

export type XsuaaGroupMemberList = XsuaaGroupMember[];

export interface XsuaaUserCreate {
  schemas: string[];
  externalId: string;
  userName: string;
  origin: string;
  active: boolean;
  name: {
    familyName: string;
    givenName: string;
    formatted?: string;
    middleName?: string;
  };
  emails: {
    type?: string;
    value: string;
    primary: boolean;
  }[];
}

export enum FilterOperator {
  EQUAL = "eq",
  CONTAINS = "co",
  STARTS_WITH = "sw",
  HAS_VALUE = "pr",
  GREATER_THAN = "gt",
  GREATER_EQUAL = "ge",
  LESS_THAN = "lt",
  LESS_EQUAL = "le",
}

export type SortOrder = "ascending" | "descending";

export interface Filter {
  property: string;
  operator: FilterOperator;
  value: string | number | boolean;
}

export interface QueryParams {
  filter?: Filter[];
  top?: number;
  skip?: number;
  sortOrder?: SortOrder;
  sortBy?: string;
}
