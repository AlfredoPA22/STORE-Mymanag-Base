import { gql } from "@apollo/client";

export const STORE_LIST_PRODUCTS = gql`
  query StoreListProducts($companyId: ID!) {
    storeListProducts(companyId: $companyId) {
      _id
      code
      name
      description
      image
      images
      sale_price
      regular_price
      stock
      status
      stock_type
      brand {
        _id
        name
      }
      category {
        _id
        name
      }
    }
  }
`;
