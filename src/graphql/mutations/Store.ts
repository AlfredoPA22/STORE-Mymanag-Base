import { gql } from "@apollo/client";

export const STORE_CREATE_ORDER = gql`
  mutation StoreCreateOrder($companyId: ID!, $storeOrderInput: StoreOrderInput!) {
    storeCreateOrder(companyId: $companyId, storeOrderInput: $storeOrderInput) {
      code
      total
      clientFullName
    }
  }
`;
