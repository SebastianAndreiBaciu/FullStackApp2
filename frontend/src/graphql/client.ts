import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = new HttpLink({
  uri: 'http://localhost:5295/graphql',
  credentials: 'omit',
})

// Add auth token dynamically to each request
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')
  const newHeaders = { ...headers }
  
  // Only add Authorization header if token exists
  if (token) {
    newHeaders.Authorization = `Bearer ${token}`
  }
  
  return {
    headers: newHeaders,
  }
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
})
