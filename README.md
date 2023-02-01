# What is YikYak?
YikYak is an anonymous message board application popular on college campuses. It allows users to anonymously post a message that anyone within 5 miles of them can see, comment on or upvote/downvote.

# What is Yak Attack?
Yak Attack is a web application that utilized the YikYak GraphQL API to obtain information not meant to be seen by users or displayed by their app. The most prominent, and dangerous, of this data is the fairely location the Yak was posted from.

# What was possible?
- Track user location by post co-ordinates.
- See the emoji of the user who posted the anonymous yak.
- Search for Yaks posted by a specific emoji.
- Search for Yaks posted at a specific location.
- Post from and view YikYaks in any location using the location changer.

(As of 9/9/22 the YikYak API no longer shares this data or it is no longer worth using)

# Why was this possible?
After YikYak released their Android application it was much easier to bypass SSL pinning and other anti reverse engineering measures that exist on iOS. With this I was able to intercept traffic from a Virtual Android Device to figure out how the app communicates with the YikYak API.

YikYak's mistake was leaving introspection enabled on their production GraphQL servers. This allowed me to freely explore all mutations, queries, types, etc on their GraphQL server. Their other, perhaps more dangerous mistake, was actually sending the co-ordinates that the post was made at to other users. I am still not sure why this was ever a thing.

To YikYak's credit, the UserID of users was not present on the GraphQL API which is good because then posts could be very easily and accurately tracked and, according to previous research and exploits, accounts could be hijacked using the UserID.

# Technologies Used
- NGINX: Used to create a proxy for the GraphQL API due to CORS in the browser.
- React, TypeScript, Redux: The entire app is written in TypeScript using React and Redux.
- GraphQL: The YikYak API is a GraphQL API acessed using the Apollo client.
- OAuth: YikYak used OAuth through Google APIs (Firebase) to authenticate users.
- Leaflet, OpenStreetMap: Used alongside Nominatim to process and display user locations.
- Nominatim API: An open source API that can convert co-ordinates to a real world address. This API was also used for other map functionality throughout the app. 
