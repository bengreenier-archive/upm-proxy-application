# upm-proxy-application

> See [upm-proxy-service](https://github.com/bengreenier/upm-proxy-service) as well

a proxy upm application, to allow users to query insecure package services. This patches the Unity installed `upm` application with a wrapper that allows insecure TLS operations to occur. While this isn't a great idea
it's designed to prove out a system using a `hosts` file entry to redirect the domain `packages.unity.com` to
a domain owned by the user. We then want to be able to make `https` calls to that domain via an application
that we don't have the source to, but we can modify via `NODE_TLS_REJECT_UNAUTHORIZED` environment variables.

__This modifies the behavior of the installed upm service__.

## How to use

> Note: these steps can be used to update the patched binary as well.

+ Download [a release](https://github.com/bengreenier/upm-proxy-application/releases)
+ Run the appropriate `patcher-<os>` application for your system
+ Give the patcher the install path to your __Unity 2017.3__ application
+ Wait for success
+ Now your local `upm` service will ignore tls issues

## License

MIT