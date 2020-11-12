import gql from "graphql-tag";

const mutations = {
  GET_PRODUCTS: gql`
    mutation getProducts($page: Int!, $limit: Int!) {
      getProducts(page: $page, limit: $limit) {
        products {
          _id
          name
          price
          image
          description
          creator
        }
        paginationInfo {
          prevPage
          nextPage
          totalPages
        }
      }
    }
  `,

  SIGN_IN: gql`
    mutation signin($email: String!, $password: String!) {
      signin(email: $email, password: $password) {
        email
        token
        id
      }
    }
  `,

  SIGN_UP: gql`
    mutation signin(
      $email: String!
      $password: String!
      $confirmPassword: String!
    ) {
      signin(
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      ) {
        email
        token
        id
      }
    }
  `,
};

export default mutations;
