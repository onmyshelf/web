# OnMyShelf Collection Manager - Web interface

# Installation
The easiest way to install OnMyShelf is to use the [docker project here](https://github.com/onmyshelf/docker).

If you want to install the web interface manually, here are the instructions:

## Requirements
- npm on your local machine
- A web server (nginx, apache, ...)

## Build & copy sources
Go into the project folder then run:
```bash
npm run build
```
Then you can copy the files of the `dist` folder to your server.

# Upgrade
If you uses the docker project, you have nothing to do.

If you have installed the web interface manually, rebuild the sources (see above).

# Development
If you want to install OnMyShelf development environment, run:
```bash
npm install
npm run dev
```
Please note that you will need to reach an available API instance with `DEV_MODE` enabled.

Create a `.env.development.local` file here with the following content to reach your API:
```
VITE_API_URL=http://<mylocalapi>/api/v1
VITE_MEDIA_URL=http://<mylocalapi>/media
```
# License
This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for the full license text.

# Credits
Website: https://onmyshelf.app

Source code: https://github.com/onmyshelf/web

Used in this project:
- CSS: https://getbootstrap.com
- Icons: https://icons.getbootstrap.com
- Images: https://undraw.co
