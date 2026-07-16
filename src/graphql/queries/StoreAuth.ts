import { gql } from "@apollo/client";

export const STORE_ME = gql`
  query StoreMe {
    storeMe {
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
    }
  }
`;

export const STORE_MY_ORDERS = gql`
  query StoreMyOrders {
    storeMyOrders {
      _id
      code
      date
      status
      total
      is_paid
    }
  }
`;

export const STORE_ORDER_DETAIL = gql`
  query StoreOrderDetail($orderId: ID!) {
    storeOrderDetail(orderId: $orderId) {
      code
      date
      status
      total
      is_paid
      address
      items {
        productId
        productName
        productImage
        quantity
        sale_price
        subtotal
      }
    }
  }
`;
