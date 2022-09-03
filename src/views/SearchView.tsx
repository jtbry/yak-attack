import { ApolloQueryResult, useApolloClient } from '@apollo/client';
import { SearchIcon } from '@heroicons/react/solid';
import { LatLng } from 'leaflet';
import { useState } from 'react';
import { getAddressFromLatLng } from '../api/nominatimApi';
import { GET_YIKYAKS_FROM_COMMENTS, GET_YIKYAK_FEED } from '../api/yikyakApi';
import { useAppSelector } from '../app/hooks';
import Button from '../components/Button';
import ListSelector from '../components/ListSelector';
import LoadingSpinner from '../components/LoadingSpinner';
import TextInput from '../components/TextInput';
import ToggleSwitch from '../components/ToggleSwitch';
import { Comment } from '../model/Comment';
import { getDataFromEdges, PaginatedEdges } from '../model/PaginatedEdges';
import { Yak } from '../model/Yak';

interface CommentWithYak extends Comment {
  yak: Yak;
}

type CommentQueryData = {
  me: {
    comments: PaginatedEdges<CommentWithYak>;
  };
};

interface Post {
  id: string;
  text: string;
  point: LatLng;
  createdAt: string;
  userEmoji: string;
  userColor: string;
  type: 'Yak' | 'Comment';
  address?: string;
}

const SEARCHABLE_FIELDS = ['Text', 'Point', 'Emoji'];

const SearchView = () => {
  const apolloClient = useApolloClient();
  const location = useAppSelector((state) => state.location.point);
  const [results, setResults] = useState<Post[]>([]);
  const [searchStage, setSearchStage] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [shouldAttachAddr, setShouldAttachAddr] = useState(true);
  const [fieldToSearch, setFieldToSearch] = useState(SEARCHABLE_FIELDS[0]);

  const postFilter = (post: Yak | Comment) => {
    if (fieldToSearch === 'Text') {
      return post.text.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (fieldToSearch === 'Point') {
      const postLatLng = `${post.point.coordinates[1]}, ${post.point.coordinates[0]}`;
      return postLatLng === searchTerm;
    } else if (fieldToSearch === 'Emoji') {
      return post.userEmoji === searchTerm;
    } else {
      return false;
    }
  };

  const searchFromMyComments = async () => {
    let hasNextPage = true;
    let afterCursor = '';
    let page = 0;
    const foundPosts: Post[] = [];

    while (hasNextPage) {
      const commentQuery: ApolloQueryResult<CommentQueryData> =
        await apolloClient.query({
          query: GET_YIKYAKS_FROM_COMMENTS,
          variables: afterCursor !== '' ? { after: afterCursor } : {},
          fetchPolicy: 'network-only',
        });

      hasNextPage = commentQuery.data.me.comments.pageInfo.hasNextPage;
      afterCursor = commentQuery.data.me.comments.pageInfo.endCursor;

      const commentedYaks = getDataFromEdges(commentQuery.data.me.comments)
        .map((comment) => comment.yak)
        .filter(postFilter);

      foundPosts.push(
        ...commentedYaks.map(
          (y): Post => ({
            id: y.id,
            text: y.text,
            point: new LatLng(y.point.coordinates[1], y.point.coordinates[0]),
            createdAt: y.createdAt,
            userEmoji: y.userEmoji,
            userColor: y.userColor,
            type: 'Yak',
          })
        )
      );

      const attachedComments = commentedYaks
        .flatMap((y) => getDataFromEdges(y.comments))
        .filter(postFilter);
      foundPosts.push(
        ...attachedComments.map(
          (c): Post => ({
            id: c.id,
            text: c.text,
            point: new LatLng(c.point.coordinates[1], c.point.coordinates[0]),
            createdAt: c.createdAt,
            userEmoji: c.userEmoji,
            userColor: c.userColor,
            type: 'Comment',
          })
        )
      );

      page++;
      setSearchStage(`Searching your comments (${page})`);
    }
    return foundPosts;
  };

  const searchFromFeed = async () => {
    let hasNextPage = true;
    let afterCursor = '';
    let page = 0;
    const feedResults: Post[] = [];

    while (hasNextPage) {
      const feedQuery: ApolloQueryResult<{ feed: PaginatedEdges<Yak> }> =
        await apolloClient.query({
          query: GET_YIKYAK_FEED,
          variables: {
            feedType: 'LOCAL',
            feedOrder: 'NEW',
            location: `POINT(${location.lng} ${location.lat})`,
            after: afterCursor,
          },
          fetchPolicy: 'network-only',
        });

      hasNextPage = feedQuery.data.feed.pageInfo.hasNextPage;
      afterCursor = feedQuery.data.feed.pageInfo.endCursor;

      const feed = getDataFromEdges(feedQuery.data.feed).filter(postFilter);

      feedResults.push(
        ...feed.map(
          (y): Post => ({
            id: y.id,
            text: y.text,
            point: new LatLng(y.point.coordinates[1], y.point.coordinates[0]),
            createdAt: y.createdAt,
            userEmoji: y.userEmoji,
            userColor: y.userColor,
            type: 'Yak',
          })
        )
      );

      const comments = feed
        .flatMap((y) => getDataFromEdges(y.comments))
        .filter((c) => c.text.toLowerCase().includes(searchTerm.toLowerCase()));
      feedResults.push(
        ...comments.map(
          (c): Post => ({
            id: c.id,
            text: c.text,
            point: new LatLng(c.point.coordinates[1], c.point.coordinates[0]),
            createdAt: c.createdAt,
            userEmoji: c.userEmoji,
            userColor: c.userColor,
            type: 'Comment',
          })
        )
      );

      page++;
      setSearchStage(`Searching local feed (${page})`);
    }

    return feedResults;
  };

  const attachAddressesToPosts = async (posts: Post[]) => {
    const cache = new Map<string, string>();
    for (let postIdx = 0; postIdx < posts.length; postIdx++) {
      setSearchStage(`Adding addresses (${postIdx + 1}/${posts.length})`);
      const cachedAddr = cache.get(posts[postIdx].point.toString());
      if (cachedAddr === undefined) {
        const address = await getAddressFromLatLng(posts[postIdx].point);
        posts[postIdx].address = address;
        cache.set(posts[postIdx].point.toString(), address);
        await new Promise((resolve) => setTimeout(resolve, 1200));
      } else {
        posts[postIdx].address = cachedAddr;
      }
    }
    return posts;
  };

  const search = async () => {
    let foundPosts: Post[] = [];

    setSearchStage('Searching your comments');
    foundPosts.push(...(await searchFromMyComments()));

    setSearchStage('Searching local feed');
    foundPosts.push(...(await searchFromFeed()));

    setSearchStage('Filtering data');
    foundPosts = foundPosts.filter(
      (value, index, self) => index === self.findIndex((t) => t.id === value.id)
    );
    foundPosts = foundPosts.sort((a, b) => {
      const aDate = new Date(a.createdAt);
      const bDate = new Date(b.createdAt);
      return bDate.getTime() - aDate.getTime();
    });

    if (shouldAttachAddr) {
      setSearchStage('Adding addresses');
      foundPosts = await attachAddressesToPosts(foundPosts);
    }

    setResults(foundPosts);
  };

  const handleSubmit = async () => {
    try {
      setSearching(true);
      await search();
    } catch (error) {
      console.error(error);
    } finally {
      setSearching(false);
    }
  };

  const exportData = () => {
    const header = Object.keys(results[0]).join(',');
    const csv = [
      header,
      ...results.map((row) =>
        Object.values(row)
          .map((v) => `"${v}"`)
          .join(',')
      ),
    ].join('\r\n');

    const blob = new Blob([csv], { type: 'octet/stream' });
    const outputUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.classList.add('hidden');
    link.href = outputUrl;
    link.download = `yak-attack_export_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(outputUrl);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row space-x-3 items-center">
        <div className="w-1/5">
          <ListSelector
            value={fieldToSearch}
            list={SEARCHABLE_FIELDS}
            onChange={(field) => setFieldToSearch(field)}
          />
        </div>
        <TextInput
          disabled={searching}
          placeholder="Search Value"
          className="w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          required
        />
        <Button
          buttonStyle="primary"
          className={`w-1/4 relative ${searching ? 'animate-pulse' : ''}`}
          onClick={handleSubmit}
          disabled={searching}
        >
          {searching ? (
            <>Checking...</>
          ) : (
            <>
              Search
              <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                <SearchIcon className="w-5 h-5" />
              </span>
            </>
          )}
        </Button>
      </div>
      <div className="flex flex-row space-x-3 items-center mt-3">
        <ToggleSwitch
          label="Include Addresses"
          enabled={shouldAttachAddr}
          setEnabled={setShouldAttachAddr}
        ></ToggleSwitch>
      </div>
      <div>
        {searching && (
          <div className="mt-12 flex flex-col items-center space-y-3">
            <h3>{searchStage}</h3>
            <LoadingSpinner size="w-24 h-24" />
          </div>
        )}
        {!searching && results.length > 0 && (
          <div className="mt-10">
            <table className="table-auto w-full text-sm text-left">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>User</th>
                  <th>Text</th>
                  <th>Created At</th>
                  <th>Lat, Lng</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id}>
                    <td>{result.type}</td>
                    <td
                      className="text-center"
                      style={{ backgroundColor: result.userColor ?? 'gray' }}
                    >
                      {result.userEmoji ?? '???'}
                    </td>
                    <td>{result.text}</td>
                    <td>{new Date(result.createdAt).toLocaleDateString()}</td>
                    <td>
                      {result.point.lat}, {result.point.lng}
                    </td>
                    <td>{result.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button
              buttonStyle="primary"
              className="mt-4 w-1/4"
              onClick={exportData}
            >
              Export Data
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchView;
