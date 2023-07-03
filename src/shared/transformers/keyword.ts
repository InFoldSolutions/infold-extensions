
/**
 * 
{
  "keyword": "Samsung Galaxy",
  "type": "organization",
  "analyzed": [
    {
      "url": "https://en.wikipedia.org/wiki/Samsung_Galaxy",
      "title": "Samsung Galaxy",
      "source": "wikipedia.org"
    }
  ],
  "added_at": "2023-03-07T11:40:12.888844+00:00"
}
 */

import { IKeyword } from "../types";

export default function transformKeyword(data: any): IKeyword {
  const analyzed = data.analyzed[0];

  let icon;
  if (analyzed && analyzed.source === "investopedia") 
    icon = "investopedia";
  else
    icon = "fab.fa-wikipedia-w";

  let url = analyzed ? analyzed.url : null;

  if (!url) {
    url = `https://www.google.com/search?q=${data.keyword}`;
    icon = "fab.fa-google";
  }

  return {
    icon: icon,
    word: data.keyword, /*(data.keyword.length > 3) ? formatKeyword(data.keyword) :*/
    url: url
  }
}

function formatKeyword(keyword: string) {
  return keyword.toLowerCase().charAt(0).toUpperCase() + keyword.slice(1).replace(/[^a-zA-Z ]/g, "");
}