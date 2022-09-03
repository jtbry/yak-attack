import { ApolloClient, createHttpLink, gql, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { User } from '../model/User';
import { googleRefreshExistingTokenIfNeeded } from './googleAuthService';

const yikyakApiUrl = createHttpLink({
  uri: 'http://localhost:8080/yikyak'
});

const authLink = setContext(async (_, { headers }) => {
  const token = await googleRefreshExistingTokenIfNeeded();

  return {
    headers: {
      ...headers,
      Authorization: token,
    }
  }
});

export const yikyakApolloClient = new ApolloClient({
  link: authLink.concat(yikyakApiUrl),
  cache: new InMemoryCache(),
});

export const getMyYikyakUser = async (): Promise<User> => {
  const result = await yikyakApolloClient.query<{ me: User }>({
    query: gql`
      query {
        me {
          id
          username
          emoji
          color
          yakarmaScore
        }
      }
      `
  });
  return result.data.me;
}

const yakFragment = gql`
  fragment YakFragment on Yak {
    id
    text
    point
    isMine
    createdAt
    userEmoji
    userColor
    voteCount
    isIncognito
    commentCount
    interestAreas
    user {
      id
      dateJoined
      username
      emoji
      color
      secondaryColor
      yakarmaScore
    }
  }
`

const commentFragment = gql`
  fragment CommentFragment on Comment {
    id
    isOp
    text
    point
    isMine
    createdAt
    userEmoji
    userColor
    voteCount
    interestAreas
  }
`

export const GET_YIKYAK_FEED = gql`
  ${yakFragment}
  query GetYikyakFeed($feedType: FeedType, $feedOrder: FeedOrder, $location: FixedPointScalar!, $after: String) {
    feed(feedType: $feedType, feedOrder: $feedOrder, point: $location, after: $after) {
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        edges {
            node {
              ...YakFragment
            }
        }
    }
  }
`

export const GET_ALL_YAKS = gql`
  ${yakFragment}
  query GetAllYaksFeed($after: String) {
    allYaks(after: $after) {
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        edges {
            node {
              ...YakFragment
            }
        }
    }
  }
`

export const GET_YIKYAK_POST = gql`
  ${yakFragment}
  ${commentFragment}
  query GetYikyakPost($id: ID!) {
    yak(id: $id) {
      ...YakFragment
      comments {
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            ...CommentFragment
          }
        }
      }
    }
  }
`

export const GET_YIKYAK_PROFILE = gql`
  ${yakFragment}
  ${commentFragment}
  query GetMyProfile {
    me {
      id
      username
      emoji
      color
      yakarmaScore
      yaks {
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            ...YakFragment
          }
        }
      }
      comments {
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            ...CommentFragment
          }
        }
      }
    }
  }
`
export const GET_YIKYAKS_FROM_COMMENTS = gql`
query GetYaksFromMyComments($after: String) {
  me {
    comments(after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          text
          yak {
            id
            text
            point
            createdAt
            userColor
            userEmoji
            comments {
              edges {
                node {
                  id
                  text
                  point
                  createdAt
                  userColor
                  userEmoji
                }
              }
            }
          }
        }
      }
    }
  }
}
`