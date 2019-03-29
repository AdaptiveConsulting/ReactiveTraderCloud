# OpenFin manifests for RT

These files contain the manifests for the different flavours of the OpenFin version of 
Reactive Trader. They are used in two ways: 

1. Passing them to the `openfin` cli during development
    - E.g. by doing `npm run openfin`, which in turn runs `openfin -c public/config/openfin/local.json -l`
2. To generate the installers. See [`src/client/install/README.md`](../../../install/README.md) for a detailed guide. 

Note that [the installers](https://openfin.co/documentation/options/#installer) are just a 
wrapper containing **the URL** to the manifest, (**not** the manifest file itself), so there's 
no need to re-generate an installer when making changes to the manifests.
