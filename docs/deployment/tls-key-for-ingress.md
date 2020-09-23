### How to create a pre-shared certificate in order to enable ssl

All the ingresses use a pre-shared certificate called `web-ssl-shared` that contains the certificate and key file.

In order to create it, run this command:
```shell script
gcloud compute ssl-certificates create web-ssl-shared  --certificate tls.crt --private-key tls.key
```

Useful link: [Specifying certificates for your Ingress](https://cloud.google.com/kubernetes-engine/docs/how-to/ingress-multi-ssl#specifying_certificates_for_your_ingress)
