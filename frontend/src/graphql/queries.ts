import { gql } from '@apollo/client'

export const CREATE_EVENIMENT_MUTATION = gql`
  mutation CreateEveniment($input: CreateEvenimentDtoInput!) {
    createEveniment(input: $input) {
      id
      nume
      data
      locatie
      userId
    }
  }
`

export const UPDATE_EVENIMENT_MUTATION = gql`
  mutation UpdateEveniment($id: Int!, $input: CreateEvenimentDtoInput!) {
    updateEveniment(id: $id, input: $input) {
      id
      nume
      data
      locatie
      userId
    }
  }
`

export const DELETE_EVENIMENT_MUTATION = gql`
  mutation DeleteEveniment($id: Int!) {
    deleteEveniment(id: $id)
  }
`

export const GET_EVENIMENTE_QUERY = gql`
  query GetEvents {
    events {
      id
      nume
      data
      locatie
      userId
    }
  }
`
