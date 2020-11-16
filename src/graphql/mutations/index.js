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

  createProduct: gql`
    mutation createProduct(
      $name: String!
      $price: Int!
      $image: String!
      $description: String!
    ) {
      addProduct(
        name: $name
        price: $price
        image: $image
        description: $description
      ) {
        _id
      }
    }
  `,

  updateProduct: gql`
    mutation updateProduct(
      $id: ID!
      $name: String!
      $price: Int!
      $image: String!
      $description: String!
    ) {
      updateProduct(
        id: $id
        name: $name
        price: $price
        image: $image
        description: $description
      ) {
        name
      }
    }
  `,

  deleteProduct: gql`
    mutation deleteProduct($id: ID!) {
      deleteProduct(id: $id)
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
    mutation signup(
      $email: String!
      $password: String!
      $confirmPassword: String!
    ) {
      signup(
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

  addToCart: gql`
    mutation addToCart($prodId: ID!) {
      addToCart(prodId: $prodId)
    }
  `,

  removeFromCart: gql`
    mutation removeFromCart($prodId: ID!) {
      removeFromCart(prodId: $prodId)
    }
  `,
  pay: gql`
    mutation pay(
      $id: ID!
      $name: String!
      $price: Int!
      $image: String!
      $description: String!
      $quantity: Int!
    ) {
      pay(
        product: {
          id: $id
          name: $name
          price: $price
          image: $image
          description: $description
          quantity: $quantity
        }
      )
    }
  `,
};

export default mutations;
