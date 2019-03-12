at this moment: only frontend part is done for now...
                backend still need more work.
               


1. Display an endless feed/stream of items/posts. We will call it ?the main feed
? . Think about the main content that users are allowed to post. Links from youtube, links to music stream or a music file, video files, long text content, short text content, maybe link to other users, etc� Think about how you want to ?model
? the different types of user posts. 
- OK
2. Think about the different user roles in your platform. For example, admin user(which is able to do anything and see everything), a regular user, anonymous user. 
- OK
3. Users should be able to sort the items/posts on the main feed by date(ascending/descending). 
- OK - added also filter in feed to see posts of friends only or all posts
4. Allow easy and circular navigation between different parts of the application. 
- OK
5. Users should be able to register. 
- OK
6. Users should be able to delete their account. 
- OK
7. Users should be able to get notifications about new items. 
- OK - notifications only for friend requests, need to add also for likes and comments
8. Each user will have its own profile page. 
- OK
9. Each user should be able to manage its own profile and add content to it(think about your profile is other social media platforms). 
- OK
10.Each user should be able to access other users profiles. 
- OK - added search input on navigation bar to search users by first name or full name, empty search will give all users
11.Each user should be able to decide which users can access its profile(everyone/public, only friends/private). Pay attention to details. What will be shown in each case? How will the functionality of the profile page change in each case(case 1 - the owner of the profile, case 2 - someone who is not the owner but allowed to view the profile, case 3 - someone who is not the owner and is not allowed to view)? 
- OK
12.Users should be able to create new items/posts. 
- OK
13.Users should be able to view all their own created posts. 
- OK
14.Users should be able to request to be a friend of other users. 
- OK
15.Users should be able to decide if they want to approve or decline the requests. 
- OK
16.Users should be able to see all their friends. 
- OK
17.Users should be able to unfriend a user. 
- OK
18.Users should be able to comment on their own posts, and other posts of other users. 
- OK
19.Each post should have comments. 
- OK
20.Users should be able to comment on a comment. 
- OK
21.Each item/post/comment should be `?likeable` by all the users who are allowed to view it. 
- OK - anonymous user cant like, post or reply
22.Each user should be able to know which users liked its posts/comments. 
- OK
23.All? input must be validated on the frontend in a meaningful way(we do not have to use javascript for that). 
- OK
24.The frontend must be visually appealing(same �look and feel� throughout the application�s UI. feel free to use frameworks). 
25.Use ?localStorage? to store data for each client(will be kept as long as the user does not clear its browser�s cache). 
- OK

NOTE: this version is only frontend, i used https://github.com/typicode/json-server as my server
