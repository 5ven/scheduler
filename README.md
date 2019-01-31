# Single Page Meeting Scheduler

This dockerised app allows for companies to have personalised URLs for members of their sales team to be used in their email campaigns. Meetings can be scheduled without relying on any third party services.

This package allows you to easily set up a development environment with three Docker containers: API, microsite and MongoDB.

#### Features
* A REST API based on elegant object-oriented code of the boilerplate developed by <a href="https://github.com/kylealwyn/node-rest-api-boilerplate">kylealwyn</a>.
* MongoDB and Mongoose are used for storing data.
* Vue.js 2.0 is used for the front-end.
* Gets the client's browser locale and timezone: converts available time slots in relation with your company's office hours, ensuring that clients will see time slots in their own local time.
* API has extensive unit tests developed using Mocha and Chai. Many originate
  from <a href="https://github.com/kylealwyn/node-rest-api-boilerplate">kylealwyn</a>'s original code and new tests have been added for most of the additional functionality developed for scheduling.
* Automatic email will be sent to that member of the sales team whose URL had been used by a client to schedule a meeting.
* Bootstrap is used to enable responsiveness and compatibility with mobile devices.
* Configurable: see the api/.env file for the API and microsite/config/settings.js for the front-end.

#### Setting up and developing
- If you are using a Mac, set up VirtualBox and a Debian instance on it. As of January, 2019, Docker for Mac has issues with local networking. Use VirtualBox's folder share functionality to mount the project folder into the virtual Debian server.
- Edit the hosts file on your local development computer and add the reference to the domain "scheduler" pointing to the local IP aadress of your VirtualBox instance or (virtual) Linux server.
- Log into the server and cd into the project folder
- Make three directories - one for logs, the other for MongoDB database files and the third for the public web
  ```console
  $ mkdir mongodb-data && mkdir -p logs/nginx && mkdir web
  ```
- if you are using a Mac and VirtualBox for testing and development, make the folder ```mkdir -p ../modules/{api,microsite}``` into the parent folder of the project. VirtualBox does not properly support linking via folder shares and this way node.js modules will be saved onto the virtual server instead of the host computer. docker-compose.yml already has these volume settings in place.
- use docker-compose to build the containers.

  ```$ docker-compose up -d```

- Change the microsite's settings to match your own, like time zone. Check ```scheduler/microsite/config/settings.js```.
- Start two separate console windows, log into your development server in each and use SSH to log into the API and Microsite containers. You will also see possible errors and logs in these windows.

  ```console
  $ docker exec -it scheduler_api_1 bash
  $ yarn install && yarn start
  ```

  and smiliarly in the second one

  ```console
  $ docker exec -it scheduler_microsite_1 bash
  $ yarn install && yarn start
  ```

- Open a third console window and log into MongoDB and import the initial admin user into the database.

  ```console
    $ docker exec -it scheduler_mongo_1 bash
    # mongo
  ```
  ```javascript
      use scheduler-devel
      db.users.insert({
        name: {
          first: 'James',
          last: 'Doe'
        },
        role: 'admin',
        skype: 'Jim2134276891',
        email: 'james@doe.com',
        password:'$2b$04$NDunia1zLBNH3ur1AWuUN.nBPeGAhxCd4b/95LRsRN6VvKq9y6fzK'
      })
  ```  
- add the .env file for the API into the folder api and define the following constants
  ```javascript
  MONGO_URI=mongodb://mongo/scheduler-devel
  SESSION_SECRET=some-long-random-string
  FROM_EMAIL=info@company.com
  ADMIN_EMAIL=admin@company.com
  COMPANY_NAME=Company LTD.
  MAILGUN_DOMAIN=mg.company.com
  MAILGUN_API_KEY=key-randomkey
  EMAIL_TITLE=New Meeting Request
  ```
- Insert additional team members having the role 'seller' into the database by using an API client like <a href="https://www.getpostman.com/" target="_blank">Postman</a>.
  * Log in as an admin and get the access token.
    ```
      Type: POST
      URL: http://scheduler/api/auth/login
      Headers:
        Content-Type: application/x-www-form-urlencoded
      Body attributes:
        email: james@doe.com
        password: supersecUrepassword123
    ```
   * Add the new sales team members. Be sure to save each user.id value from the response for every team member. You will need these for their personal URLs so that scheduling requests will be targeted to the right sales person. URLs will be in this format: http://scheduler/id/the-mongodb-id-fo-the-team-member
      ```
        Type: POST
        URL: http://scheduler/api/user
        Headers:
          Content-Type: application/x-www-form-urlencoded
          authorization: the-token-from-the-admin-auth-request
        Body attributes:
          name[first]: Jimmy
          name[last]: Doe
          email: jimmy@doe.com
          password: somelongandsecurepassword
          role: seller
          skype: jimmy456565
      ```
- You can use "yarn test" to run all the available tests in the API container.
- Uses the <a href="https://github.com/webpack/webpack-dev-server/issues/882" target="_blank">disableHostCheck option in WebPack</a> because of a proxy and running locally. See ```microsite/build/webpack.dev.conf.js```.
- the default user is "root" both for API and microsite and you might want to change to "node" after successfully setting up the app. Edit docker-compose.yml.
    ```yml
    microsite:
      user: "node"
    ```
    Then rebuild the container

#### Some tips for going live
- Build the Vue microsite and copy the files to the public web folder.

  Make sure that the user is root, otherwise the code cannot be compiled as there will be access restrictions.
  Then rebuild the container and and build.

  ```console
  $ docker exec -it scheduler_microsite_1 bash
  # yarn build
  ```
  Copy the generated files from ```microsite/dist``` into nginx's public html folder ```web``` and configure nginx accordingly by modifying ```etc/nginx/config/conf.d/proxy-web.conf```.

- Secure the site by configuring LetsEncrypt for it and change the settings for nginx accordingly at ```etc/nginx/config/conf.d/proxy-web.conf```. Also remember to edit docker-compose.yml and enable the LetsEncrypt- and port 443-related parts.

- Edit docker-compose.yml and set value of NODE_ENV to "production" for both for the API and microsite.

- Remove the line having CHOKIDAR_USEPOLLING from docker-compose.yml as this is only needed for development on a Mac to <a href="https://tw.saowen.com/a/097837fac94163680f564644296e67b5d38ad9e98e36fae3f55b1bac7e68c07b" target="_blank">ensure file reloads</a> on edits.

- For improved performance use a PM2-enabled node.js Docker image or build one by yourself for the API and change the docker-compose.yml accordingly.

- Modify ```etc/nginx/config/nginx.conf``` and add more ```worker_processes``` if needed.

- <b>IMPORTANT!</b> Remember the issues Docker has with iptables! Either manually configure iptables after you have set up the containers or use a front-facing firewall possibly offered by your cloud service. Also remember to protect MongoDB from outside access by setting up a user and changing the API's configuration at ```app/config/constants.js``` (see environmentConfigs ->
mongo -> uri). You might want to disable "disableHostCheck" for improved security. Do not run the daemons under the "root" user and set the user "node" instead.
