import { HeroImage } from '@/components/articleElements';
import Head from 'next/head';
import React from 'react';

const ArticleBlock = React.lazy(() =>
  import('@/components/articleElements').then((module) => ({ default: module.ArticleBlock })),
);
const CodeBlock = React.lazy(() =>
  import('@/components/articleElements').then((module) => ({ default: module.CodeBlock })),
);

const HERO_IMAGE = '/article_assets/unbound-docker/hero.png';

const Contemplation = () => {
  return (
    <div>
      <Head>
        <title>Contemplation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:description"
          content="Creating a small docker container for an updated unbound."
        />
        <meta property="og:title" content="Dockerising Unbound DNS" />
        <meta property="og:image" content="" />
        <meta name="author" content="Owen Elliott" />
        <meta name="tags" content="Networking, DNS, self-hosting, privacy" />
        <meta property="og:type" content="article" />
      </Head>
      <HeroImage imageURL={HERO_IMAGE} />
      <div className="article">
        <ArticleBlock>
          {`
# Dockerising Unbound for Local Recursive DNS

There is nothing more satisfying than building something to solves a personal need, I recently created [unbound-docker](https://github.com/OwenElliottDev/unbound-docker) to solve my challenges running Unbound as a self hosted recursive Domain Name Server (DNS) resolver alongside Pi-Hole in a Docker Compose. [unbound-docker](https://github.com/OwenElliottDev/unbound-docker) is only \`7MB\` to pull (compressed).

I was downloading the images for one of the Conceptual Captions datasets for a different project and I noticed that it was slamming my Pi-Hole with over 500 QPS and 8 million DNS queries during the download process. My poor Raspberry Pi was out of memory with 100% of its swap in use as well. I later rebooted it to bring it back to life but it took over an hour to boot up as it was loading all the logged requests from when I was downloading the dataset.

I also have a much bigger home server so I thought it was probably about time to move Pi-Hole over to that. I quickly ran into the issue of wanting to run Unbound for DNS resolution with the Pi-Hole Docker container. There are a few Unbound Docker containers out there but they looked to be mostly unmaintained and contained hard coded configurations. Unbound's latest release patches a domain hijacking attack (\`CVE-2025-11411\`) and while it's unlikely to affect a local setup which isn't exposed to the public internet, I always like to be on top of my security patches just in case.

So this necessitated the creation of my own container for Unbound, [owenelliottdev/unbound](https://hub.docker.com/r/owenelliottdev/unbound).

This article will cover:
+ What Unbound is, and why you might want it
+ How to build a container for Unbound
    + Building Unbound from source
    + Unbound configuration for performance and security
+ DNS vulnerabilities and Docker networking
    + Integration with Pi-Hole 

## What is Unbound and why would you want it?

Unbound is an open-source recursive DNS resolver. It is distinct from public DNS services (like Google DNS) or your ISP's default resolver in that it only talks to _authoritative_ name servers. Most DNS servers are caching recursive resolvers, meaning they store a cache of domain names and IP addresses; anything that isn't in their cache is resolved recursively by talking to the authoritative name servers. Authoritative name servers are special servers that are the authority on all domains in a zone. 

Hosting your own recursive solver has a few benefits:
+ __Privacy:__ It cuts out a middle man (e.g. Google or your ISP) who gets to see every domain you visit and can use it for advertising.
+ __Interference:__ A classic way that governments and companies control what you see is by blocking the resolution of domains or redirecting them to other addresses.
+ __Security:__ Public DNS caching servers are also a prime target for attackers. If an attack managed to poison the cache on something like Google's DNS then millions of users could be routed to malicious sites. Having your own recursive DNS reduces the risk of caching poisoning.
+ __Speed (sometimes):__ When you have a domain in your cache on Unbound the resolution is nearly instant, potentially hundreds or thousands of times faster than public DNS. However, when you don't have an entry in the cache it can be much slower than a public DNS as it has to do a lot of back and forth to resolve the domain recursively. Though, in my experience this is barely noticeable though.

## Making a small container

For a functioning instance of Unbound, there isn't much you need - just the binaries and configs that Unbound requires. I wanted to focus on providing a sensible set of defaults, flexibility for users to customise some aspects of the config, having the latest release of Unbound, and having a small bloat-free container.

### Multi-stage build

#### Building from source
\`unbound-docker\` uses a multi-stage build on the Alpine Linux image which is known for being a small container. Unbound is also built with \`libevent\` which enables efficient handling of many concurrent connections. Using \`libevent\` with a higher value for \`outgoing-range\` improves concurrency for outgoing DNS queries, especially on multi-CPU machines`}
        </ArticleBlock>
        <CodeBlock language="dockerfile">
          {`FROM alpine:latest AS builder
RUN apk add --no-cache build-base git libevent-dev openssl-dev expat-dev flex bison


RUN git clone --branch release-1.24.1 https://github.com/NLnetLabs/unbound.git \\
    && cd unbound \\
    && ./configure --with-libevent \\
    && make \\
    && make install`}
        </CodeBlock>
        <ArticleBlock>
          {`The build stage installs all the tools and libraries that we require to build Unbound. In the next stage we can just extract the output of the build and leave behind all the tooling we no longer need, resulting in a much smaller image.
          
#### Making it customisable

Instead of making the entrypoint be Unbound directly, the entrypoint is a bash script that creates the Unbound configuration before starting it. This means that users can change some of the configurations using environment variables to tune the Unbound settings for their platform/requirements.`}
        </ArticleBlock>
        <CodeBlock language="dockerfile">
          {`FROM alpine:latest

RUN apk add --no-cache libevent openssl expat

COPY --from=builder /usr/local/sbin/unbound /usr/local/sbin/unbound
COPY --from=builder /usr/local/etc/unbound /usr/local/etc/unbound

ENV UNBOUND_NUM_THREADS=8 \\
    UNBOUND_MSG_CACHE_SIZE=125m \\
    UNBOUND_RRSET_CACHE_SIZE=250m \\
    UNBOUND_PREFETCH=yes \\
    UNBOUND_DO_IP6=yes \\
    UNBOUND_EDNS_BUFFER_SIZE=1232 \\
    UNBOUND_SO_REUSEPORT=yes \\
    UNBOUND_CACHE_MAX_TTL=86400 \\
    UNBOUND_CACHE_MIN_TTL=300 \\
    UNBOUND_PREFETCH_KEY=yes \\
    UNBOUND_OUTGOING_RANGE=8192 

# Expose the DNS port
EXPOSE 5335

RUN adduser -D -u 1000 unbound

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]`}
        </CodeBlock>
        <ArticleBlock>
          {`The \`entrypoint.sh\` script writes out the config and then starts Unbound with the binary we compiled in the build phase:`}
        </ArticleBlock>
        <CodeBlock language="bash">
          {`#!/bin/sh
set -e
mkdir -p /etc/unbound/unbound.conf.d/

cat << EOF > /etc/unbound/unbound.conf
include: "/etc/unbound/unbound.conf.d/*.conf"
EOF

# Generate Unbound configuration
cat << EOF > /etc/unbound/unbound.conf.d/docker.conf
server:
    verbosity: 0
    log-queries: no
    interface: 0.0.0.0
    port: 5335
    do-ip4: yes
    do-udp: yes
    do-tcp: yes
    do-ip6: \${UNBOUND_DO_IP6}
    prefer-ip6: no
    harden-glue: yes
    harden-dnssec-stripped: yes
    use-caps-for-id: no
    edns-buffer-size: \${UNBOUND_EDNS_BUFFER_SIZE}
    prefetch: \${UNBOUND_PREFETCH}
    prefetch-key: \${UNBOUND_PREFETCH_KEY}
    num-threads: \${UNBOUND_NUM_THREADS}
    rrset-cache-size: \${UNBOUND_RRSET_CACHE_SIZE}
    msg-cache-size: \${UNBOUND_MSG_CACHE_SIZE}
    so-reuseport: \${UNBOUND_SO_REUSEPORT}
    cache-max-ttl: \${UNBOUND_CACHE_MAX_TTL}
    cache-min-ttl: \${UNBOUND_CACHE_MIN_TTL}
    outgoing-range: \${UNBOUND_OUTGOING_RANGE}
    private-address: 192.168.0.0/16
    private-address: 169.254.0.0/16
    private-address: 172.16.0.0/12
    private-address: 10.0.0.0/8
    private-address: fd00::/8
    private-address: fe80::/10
    private-address: 192.0.2.0/24
    private-address: 198.51.100.0/24
    private-address: 203.0.113.0/24
    private-address: 255.255.255.255/32
    private-address: 2001:db8::/32
    qname-minimisation: yes
    access-control: 127.0.0.1/32 allow
    access-control: 192.168.0.0/16 allow
    access-control: 172.16.0.0/12 allow
    access-control: 10.0.0.0/8 allow
EOF

# Start Unbound in the foreground
exec /usr/local/sbin/unbound -d -c /etc/unbound/unbound.conf
`}
        </CodeBlock>
        <ArticleBlock>
          {`The majority of settings in the config are hardcoded as there isn't a strong need to change them for most use cases and they are sensible defaults from a security perspective. To accept queries from outside of the container we need to listen on all interfaces (\`0.0.0.0\`). While not normally recommended it is acceptable in this instance because we can control the networking of the container from the outside to limit access and avoid exposing the DNS to bad actors.

The configurable variables are mostly related to performance and DNS resolution behaviour (that isn't heavily security related).

## Running the container

Now we have a container that we can build it's pretty easy to run it:`}
        </ArticleBlock>
        <CodeBlock language="yaml">
          {`services:
  unbound:
    container_name: unbound
    image: owenelliottdev/unbound:latest
    ports:
      - "5335:5335/tcp"
      - "5335:5335/udp"
    restart: unless-stopped`}
        </CodeBlock>
        <ArticleBlock>
          {`Anything that sends DNS queries to unbound:5335 or localhost:5335 on the host machine will have their queries resolved by Unbound. This configuration makes Unbound accessible on the LAN. It's important that this port is not forwarded to the public internet; exposing our DNS would make us vulnerable to DNS amplification attacks and cache snooping.

As I mentioned earlier, we can lock down our networking with Docker to make things more secure. If we run Unbound on a network in Docker then we can add other containers to that network to let them talk to Unbound without having to expose Unbound to the host machine.`}
        </ArticleBlock>
        <CodeBlock language="yaml">
          {`services:
  unbound:
    container_name: unbound
    image: owenelliottdev/unbound:latest
    restart: unless-stopped
    networks:
    - unbound_dns

networks:
  unbound_dns:
    driver: bridge`}
        </CodeBlock>

        <ArticleBlock>{`To integrate Unbound with Pi-Hole, your Docker Compose might look like this:`}</ArticleBlock>

        <CodeBlock language="yaml">
          {`services:
  pihole:
    container_name: pihole
    image: pihole/pihole:latest
    networks: # Addition of networks to the typical Pi-Hole compose
      - unbound_dns
      - default
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "80:80/tcp"
      - "443:443/tcp"
    environment:
      TZ: 'Europe/London'
      FTLCONF_webserver_api_password: 'correct horse battery staple'
      FTLCONF_dns_listeningMode: 'all'
    volumes:
      - './etc-pihole:/etc/pihole'
    cap_add:
      - NET_ADMIN
      - SYS_TIME
      - SYS_NICE
    restart: unless-stopped
  unbound:
    container_name: unbound
    image: owenelliottdev/unbound:latest
    networks:
      - unbound_dns
    restart: unless-stopped

networks:
  unbound_dns:
    driver: bridge`}
        </CodeBlock>
        <ArticleBlock>
          {`In the Pi-Hole admin console you then just need to set the DNS as \`unbound#5335\` (the \`#\` is the Pi-Hole syntax for the port).
          
By running Unbound in Docker alongside Pi-Hole, you get a fast, secure, and private DNS resolver that's easy to manage. With a small, configurable container and proper network isolation, you can enjoy full control over your DNS while keeping your home network safe.`}
        </ArticleBlock>
      </div>
    </div>
  );
};

export default Contemplation;
