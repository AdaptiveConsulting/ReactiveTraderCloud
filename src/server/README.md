Adaptive Server
===============

## Getting Started
### Get DNX
Instructions [here](http://blogs.msdn.com/b/sujitdmello/archive/2015/04/23/step-by-step-installation-instructions-for-getting-dnx-on-your-laptop.aspx)

#### Get External Dependencies 
Run 'Get Dependencies.bat' once to grab external dependencies (this runs `dnu restore`)

#### Set up a local Event Store and populate with sample data
Currently we require a local event store to be created if you want to write and read events
* [Download Event Store]( https://geteventstore.com/downloads)
* Follow the [getting started instructions](http://docs.geteventstore.com/introduction/)
* Run `Populate Event Store.bat`

#### Start Services
* Run `Message Broker Instance.bat` first
* Run `Pricing Instance.bat`
* Run `Reference Instance.bat`