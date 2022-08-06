import { LatLng } from 'leaflet';
import { useState } from 'react';
import { useMap } from 'react-leaflet';
import {
  LocationSearchResult,
  searchForLocation,
} from '../../api/nominatimApi';
import TextInput from '../TextInput';
import CustomControl from './CustomControl';

interface LocationSearchProps {
  onResultClicked?: (result: LocationSearchResult) => void;
}
const LocationSearch = ({
  onResultClicked: resultClicked,
}: LocationSearchProps) => {
  const map = useMap();
  const [searchResults, setSearchResults] = useState<
    LocationSearchResult[] | null
  >([]);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const executeSearch = async (query: string) => {
    try {
      const results = await searchForLocation(query);
      setSearchResults(results);
    } catch (ex) {
      console.error(ex);
    }
  };

  const handleTextChange = (text: string) => {
    setSearchQuery(text);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(setTimeout(() => executeSearch(text), 500));
  };

  let resultsRender = <></>;
  if (searchResults === null) {
    resultsRender = <h1>Error</h1>;
  } else if (searchResults.length > 0) {
    resultsRender = (
      <div className="bg-white text-zinc-900">
        {searchResults.map((result, index) => {
          return (
            <div
              key={index}
              className="p-2 cursor-pointer hover:bg-slate-200"
              onClick={() => {
                setSearchResults([]);
                setSearchQuery('');
                if (resultClicked) {
                  resultClicked(result);
                }
                map.setView(new LatLng(result.lat, result.lon), 15);
              }}
            >
              {result.display_name}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <CustomControl position="topright">
      <TextInput
        className="rounded-none dark:bg-white dark:text-zinc-900 w-full"
        value={searchQuery}
        onChange={(e) => handleTextChange(e.target.value)}
      />
      {resultsRender}
    </CustomControl>
  );
};

export default LocationSearch;
