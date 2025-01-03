/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root';
import { Route as LoginImport } from './routes/login';
import { Route as AuthImport } from './routes/_auth';
import { Route as IndexImport } from './routes/index';
import { Route as AuthDashboardImport } from './routes/_auth.dashboard';
import { Route as AuthTasklistTasklistIdImport } from './routes/_auth.tasklist.$tasklistId';

// Create/Update Routes

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any);

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any);

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any);

const AuthDashboardRoute = AuthDashboardImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => AuthRoute,
} as any);

const AuthTasklistTasklistIdRoute = AuthTasklistTasklistIdImport.update({
  id: '/tasklist/$tasklistId',
  path: '/tasklist/$tasklistId',
  getParentRoute: () => AuthRoute,
} as any);

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/';
      path: '/';
      fullPath: '/';
      preLoaderRoute: typeof IndexImport;
      parentRoute: typeof rootRoute;
    };
    '/_auth': {
      id: '/_auth';
      path: '';
      fullPath: '';
      preLoaderRoute: typeof AuthImport;
      parentRoute: typeof rootRoute;
    };
    '/login': {
      id: '/login';
      path: '/login';
      fullPath: '/login';
      preLoaderRoute: typeof LoginImport;
      parentRoute: typeof rootRoute;
    };
    '/_auth/dashboard': {
      id: '/_auth/dashboard';
      path: '/dashboard';
      fullPath: '/dashboard';
      preLoaderRoute: typeof AuthDashboardImport;
      parentRoute: typeof AuthImport;
    };
    '/_auth/tasklist/$tasklistId': {
      id: '/_auth/tasklist/$tasklistId';
      path: '/tasklist/$tasklistId';
      fullPath: '/tasklist/$tasklistId';
      preLoaderRoute: typeof AuthTasklistTasklistIdImport;
      parentRoute: typeof AuthImport;
    };
  }
}

// Create and export the route tree

interface AuthRouteChildren {
  AuthDashboardRoute: typeof AuthDashboardRoute;
  AuthTasklistTasklistIdRoute: typeof AuthTasklistTasklistIdRoute;
}

const AuthRouteChildren: AuthRouteChildren = {
  AuthDashboardRoute: AuthDashboardRoute,
  AuthTasklistTasklistIdRoute: AuthTasklistTasklistIdRoute,
};

const AuthRouteWithChildren = AuthRoute._addFileChildren(AuthRouteChildren);

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute;
  '': typeof AuthRouteWithChildren;
  '/login': typeof LoginRoute;
  '/dashboard': typeof AuthDashboardRoute;
  '/tasklist/$tasklistId': typeof AuthTasklistTasklistIdRoute;
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute;
  '': typeof AuthRouteWithChildren;
  '/login': typeof LoginRoute;
  '/dashboard': typeof AuthDashboardRoute;
  '/tasklist/$tasklistId': typeof AuthTasklistTasklistIdRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  '/': typeof IndexRoute;
  '/_auth': typeof AuthRouteWithChildren;
  '/login': typeof LoginRoute;
  '/_auth/dashboard': typeof AuthDashboardRoute;
  '/_auth/tasklist/$tasklistId': typeof AuthTasklistTasklistIdRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths: '/' | '' | '/login' | '/dashboard' | '/tasklist/$tasklistId';
  fileRoutesByTo: FileRoutesByTo;
  to: '/' | '' | '/login' | '/dashboard' | '/tasklist/$tasklistId';
  id:
    | '__root__'
    | '/'
    | '/_auth'
    | '/login'
    | '/_auth/dashboard'
    | '/_auth/tasklist/$tasklistId';
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
  AuthRoute: typeof AuthRouteWithChildren;
  LoginRoute: typeof LoginRoute;
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AuthRoute: AuthRouteWithChildren,
  LoginRoute: LoginRoute,
};

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_auth",
        "/login"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_auth": {
      "filePath": "_auth.tsx",
      "children": [
        "/_auth/dashboard",
        "/_auth/tasklist/$tasklistId"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/_auth/dashboard": {
      "filePath": "_auth.dashboard.tsx",
      "parent": "/_auth"
    },
    "/_auth/tasklist/$tasklistId": {
      "filePath": "_auth.tasklist.$tasklistId.tsx",
      "parent": "/_auth"
    }
  }
}
ROUTE_MANIFEST_END */
