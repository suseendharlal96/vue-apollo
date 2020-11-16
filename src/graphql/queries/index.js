import gql from "graphql-tag";

const queries = {
  getCart: gql`
    query getCart {
      getCart {
        _id
        userId
        products {
          _id
          name
          price
          image
          description
          quantity
        }
      }
    }
  `,

  getOrders: gql`
    query getOrders {
      getOrders {
        _id
        userId
        products {
          _id
          name
          price
          image
          description
          quantity
          date
        }
      }
    }
  `,
};

export default queries;
