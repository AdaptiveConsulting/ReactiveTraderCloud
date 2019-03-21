# OpenFin manifests for RT

These files contain the manifests for the different flavours of the OpenFin version of Reactive Trader. They are used in two ways: 

1. Passing them to the `openfin` cli during development
    - E.g. by doing `npm run openfin`, which in turn runs `openfin -c public/config/openfin/local.json -l`
2. To generate the installers. Please see [`src/client/install/README.md`](../../../install/README.md) for a detailed guide. 

Please make sure that every time changes are made to these manifests, their corresponding installers every time changes are re-created using the most up to date ones.

