# AdaptiveTrader.deploy.googleCloudEngine

**WARNING: This documentation is old and have not been validated for new mechanism**

### To initialise a project by hand:
- go to [google developer console](https://console.developers.google.com)
- click on `Free Trial`
- `fill` informations (you need to add a billing card)
- go to [google developer console projects](https://console.developers.google.com/project)
- create a new project.
- Click on `Gallery` in top left corner
- Enable the container Engine API
- Click on `ContainerEngine` in that gallery menu
- `Create a container cluster`
- `fill` the different needed elements and validate

### Running the gcloud sdk 
I use the docker way for this task.  
You need to setup docker to run this part.   
If you go to google documentation, you will find that gcloud sdk is available for windows. But `kubectl` is not available. So I choose to do all in the same way.

- run `./gcloud.sh init` in this folder. That will download a container with the gcloud sdk and run an interactive command to configure your environment with your project data.
- the CLI will ask you to login, answer `y`
- It will prompt an url that you need to `copy/paste` to your `browser`.
- `Paste it in firefox` (chrome change the EOL with %20, you will need to copy paste to a text editor before copy/paste to chrome)
- `Authenticate` with your account
- `Copy` the token
- `Paste` in CLI with a right click
- enter your `project name` (filled in the first part of that page)
- do not clone the repository
