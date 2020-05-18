# OpenFin Manifests for Reactive Trader

These JSON files contain the manifests for the OpenFin version of 
Reactive Trader. They are used in two ways: 

1. Passing them to the `openfin cli` during development, e.g. by doing `npm run openfin`, which in turn runs `openfin -c public/config/openfin/local.json -l`
2. To generate the installers. See [`src/client/install/README.md`](../../../install/README.md) for a detailed guide. 

Instead of using static manifests from source control, we now use deployed manifests instead. The local manifest files are
still used for local development, and the old demo manifests remain for backward compatability reasons, but the
deployed manifests should now be changed in the `src/server/node/openfin-config` service.

You can see the deployed manifests for the Demo environment, for example, at:
* https://web-demo.adaptivecluster.com/openfin/app.json
* https://web-demo.adaptivecluster.com/openfin/launcher.json

> **Note:** that [generated installers](../../../install) are just a 
wrapper containing **the URL** to the manifest, (**not** the manifest file itself), so there's 
no need to re-generate an installer when making changes to the manifests.
