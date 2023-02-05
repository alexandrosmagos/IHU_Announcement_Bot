
<a name="readme-top"></a>


<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/alexandrosmagos/iee-ihu-api-example">
    <img src="logo.jpg" alt="Logo" width="512" height="512">
  </a>

<h3 align="center">An announcement bot</h3>

  <p align="center">
    A simple API example using International Hellenic University's API in NodeJS.
    <br />
    <a href="https://github.com/alexandrosmagos/iee-ihu-api-example/issues">Report Bug</a>
    ·
    <a href="https://github.com/alexandrosmagos/iee-ihu-api-example/issues">Request Feature</a>
    ·
    <a href="https://login.iee.ihu.gr/">API Docs</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#libraries-used">Libraries Used</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This Discord Bot is designed to help students stay up-to-date with the latest announcements from the university. 
It periodically checks for new announcements and posts them on the university's students' Discord server. 
Additionally, students can register for announcements for specific subjects and receive notifications directly through the bot. 
The bot uses the university's API and OAuth2 for student verification to ensure secure and personalized experiences.
<!-- Here's a blank template to get started: To avoid retyping too much info. Do a search and replace with your text editor for the following: `github_username`, `repo_name`, `twitter_handle`, `linkedin_username`, `email_client`, `email`, `project_title`, `project_description` -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![nodeJS][nodeJS.org]][nodeJS-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Libraries Used

* [Express](https://www.npmjs.com/package/express) - Web Application Framework & Routes
* [Axios](https://www.npmjs.com/package/axios) - HTTP client used for GET & POST requests
* [express-session](https://www.npmjs.com/package/express-session) - Creating sessions
* [chalk](https://www.npmjs.com/package/chalk) - Colors on console logs


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

* API Client ID & Secret
  ```sh
  1. Go to https://login.iee.ihu.gr/
  2. Follow the instructions to create a new app.
  3. Copy the Client ID and Client Secret for the next steps below.
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/alexandrosmagos/iee-ihu-api-example.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Rename the '.env.example' to '.env'
3. Enter your CLIENT_ID, CLIENT_SECRET, and change the Scopes if needed, in `.env`
   ```js
	PORT=3000
	CLIENT_ID=
	CLIENT_SECRET=
	SCOPES=announcements,notifications,profile
	REDIRECT_URI=http://localhost:3000/callback
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage
1. Run the app
   ```sh
   npm run dev - To run it with nodemon
   node app - To run it normally
   ```
2. Open your browser to localhost:3000, or a diffrent port if changed.
3. Observe console going through the steps, while authentication.
4. If everything goes correctly, it should be like this:
<br>
<img src="img/usage.jpg" alt="Usage" >

<p align="right">(<a href="#readme-top">back to top</a>)</p>

See the [open issues](https://github.com/alexandrosmagos/iee-ihu-api-example/issues) for a full list of proposed features (and known issues).

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under The Unlicense License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments
By Using this project, you agree to the following:
* I am not responsible for any wrong use of the API.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/alexandrosmagos/iee-ihu-api-example.svg?style=for-the-badge
[contributors-url]: https://github.com/alexandrosmagos/iee-ihu-api-example/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/alexandrosmagos/iee-ihu-api-example.svg?style=for-the-badge
[forks-url]: https://github.com/alexandrosmagos/iee-ihu-api-example/network/members
[stars-shield]: https://img.shields.io/github/stars/alexandrosmagos/iee-ihu-api-example.svg?style=for-the-badge
[stars-url]: https://github.com/alexandrosmagos/iee-ihu-api-example/stargazers
[issues-shield]: https://img.shields.io/github/issues/alexandrosmagos/iee-ihu-api-example.svg?style=for-the-badge
[issues-url]: https://github.com/alexandrosmagos/iee-ihu-api-example/issues
[license-shield]: https://img.shields.io/github/license/alexandrosmagos/iee-ihu-api-example.svg?style=for-the-badge
[license-url]: https://github.com/alexandrosmagos/iee-ihu-api-example/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/alexandrosmagos/
[product-screenshot]: images/screenshot.png
[nodeJS.org]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[nodeJS-url]: https://nodejs.org/
