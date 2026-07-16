import { gql } from "@apollo/client";

const STORE_AUTH_RESULT_FIELDS = `
  token
  client {
    _id
    fullName
    phoneNumber
    email
    address
  }
  cart {
    productId
    name
    image
    sale_price
    stock
    quantity
  }
`;

export const STORE_REGISTER = gql`
  mutation StoreRegister($companyId: ID!, $input: StoreRegisterInput!) {
    storeRegister(companyId: $companyId, input: $input) {
      ${STORE_AUTH_RESULT_FIELDS}
    }
  }
`;

export const STORE_LOGIN = gql`
  mutation StoreLogin($companyId: ID!, $phoneNumber: String!, $password: String!) {
    storeLogin(companyId: $companyId, phoneNumber: $phoneNumber, password: $password) {
      ${STORE_AUTH_RESULT_FIELDS}
    }
  }
`;

export const STORE_UPDATE_CART = gql`
  mutation StoreUpdateCart($items: [StoreCartItemInput!]!) {
    storeUpdateCart(items: $items) {
      productId
      name
      image
      sale_price
      stock
      quantity
    }
  }
`;

export const STORE_CREATE_ORDER_FOR_CLIENT = gql`
  mutation StoreCreateOrderForClient($items: [StoreCartItemInput!]!, $address: String) {
    storeCreateOrderForClient(items: $items, address: $address) {
      code
      total
      clientFullName
    }
  }
`;

export const STORE_UPDATE_PROFILE = gql`
  mutation StoreUpdateProfile($input: StoreUpdateProfileInput!) {
    storeUpdateProfile(input: $input) {
      _id
      fullName
      phoneNumber
      email
      address
    }
  }
`;
