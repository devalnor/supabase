---
title: Surviving Hacker News 
description: Everything that went wrong with Supabase's launch
author: Paul Copplestone
author_title: Supabase
author_url: https://github.com/kiwicopple
author_image_url: https://avatars2.githubusercontent.com/u/10214025?s=400&u=c6775be2ae667e2acae3ccd347fed62bb3f5b3e7&v=4
authorURL: https://github.com/kiwicopple
tags: 
    - supabase
---

import Image from '@theme/IdealImage';

On May 27 Supabase hit the [top of Hacker News](https://news.ycombinator.com/item?id=23319901) and stayed on the front page for more than 24 hours. 

<!--truncate-->

Since then, Supabase has been featured on the [Stack Overflow podcast](https://stackoverflow.blog/2020/06/05/podcast-241-new-tools-for-new-times/), hit the [trending page](https://twitter.com/supabase_io/status/1268062559023685633) on GitHub, and scaled to over 1000 databases.

Here is everything that went wrong along the way.

## Quick stats - launch week

Before we get into the details, here are some high-level numbers for the week following the launch.

We had 30,000 new website visitors to [supabase.io](http://supabase.io):
<Image img={require('../static/img/supabase-traffic-may.png')} alt="This graph shows the traffic to our website, that peaks at 15,000 the first day and tails off throughout the week. We had a total of 30,000 visitors to our site. That's according to Google Analytics though, and everyone on HN blocks GA so who knows what the real number is."/>
<br />

We had over 1400 signups in 7 days:
<Image img={require('../static/img/hn-launch.png')} alt="This graph shows our signups. Before the launch we had around 100 signups. After the launch it sky-rocketed to 600 in the first day, 900 by the second, and 1000 by the third day. By the end of the week we had over 1400 signups."/>
<br />

Github stars rocketed for our two main repos, [supabase](https://github.com/supabase/supabase) and [realtime](https://github.com/supabase/realtime). 
<Image img={require('../static/img/supabase-github-stars-june.png')} alt="This graph shows our github stars. It's basically a vertical line. Our main repo went from 300 stars to 1300 overnight."/>
<br />

## The good

Here are the things that survived well.

### Middleware: docker-compose up

This was the most surprising survivor. Our middleware was served from a single Ubuntu server with 4 CPUs and 8GB of RAM. This server was running our middleware using `docker-compose up`:

<Image img={require('../static/img/supabase-middleware-docker.png')} alt="This image shows in middleware architecture. We used docker-compose to pull up 5 open source tools: Kong, Realtime, PostgREST, PG-API, and PG-BOSS."/>
<br />

In case you're wondering why any sane company would use that in production, it's because we weren't planning to launch - the HackerNews post was created by an early GitHub follower, while we were alpha testing, and it was too scary to migrate the middleware while it was servicing the thundering herd. All Supabase projects use the same middleware stack (sans docker-compose), so I guess this counts as as a successful load test. 

We have since migrated our middleware to multiple ECS clusters, globally load-balanced using AWS's [Global Accelerator](https://aws.amazon.com/global-accelerator/). 

### Frontend: Netlify, Vercel, Auth0

We serve our marketing site ([supabase.io](http://supabase.io)) from Netlify. It's a [Docusaurus (v2)](https://v2.docusaurus.io/) site, which is a static build so it had no problems (apart from one developer in Russia who couldn't access the site - it looks like some of Netlify's IP addresses are blocked there).

We serve our app ([app.supabase.io](http://app.supabase.io)) using Vercel, and the login system uses Auth0. These were both rock-solid. Before the launch we noticed that Vercel was extremely slow on their free plan, and once we upgraded to their Pro Plan for multi-region deploys and it solved all of our issues. It looks like they are changing their plans again so buyer beware.

## The Bad

### Cloud limits: Digital Ocean

In May we were using Digital Ocean to serve all of our customer databases. We hit the first server limit (400 servers) in the space of a few hours. They bumped our limit up to 1000 and we hit that again a few hours later. 

Digital Ocean were very responsive when we asked for increases, each time responding in 30 minutes or less.

### Cloudflare cloud limits

Each Supabase project gets a unique URL for their API and database. This is set up using Cloudflare's API. This was a seamless process until we hit the 1000 subdomain limit, at 4am in the morning. My cofounder was awake at this time, and managed to identify the problem early,and reached out to the support to increase the limit. 

Cloudflare support advised him to upgrade the account to increase the limit, but the upgrade could only be done by the owner (me). Unfortunately my phone was on silent, so for 3 hours our systems were down.

This seems like a flaw in the Cloudflare process. Ideally any one of our team could have upgraded our account.

## The Ugly - migrating 1800 servers

Let me start this section by saying that Digital Ocean have been pretty good for getting up and running. The experience was great to start with, but ended painfully. 

### Production errors

The first sign of problems were the frequent production errors. This is a screenshot of emails from Digital ocean for the month of June.

<Image img={require('../static/img/digital-ocean-emails-errors.png')} alt="This image shows all the emails I was receiving from Digital Ocean. I was receiving an email every other day about servers which needed to be migrated."/>
<br />

Each of these emails represents one or more servers that has a server issue - most of the time it was 2 servers.

> We have identified an issue on the physical machine hosting one or more of your Droplets. In the event that we are not able to perform a live migration of a Droplet, we will perform an offline migration during which the Droplet will be powered off and migrated offline during the window.

Luckily we are in alpha, and our community has been extremely patient. 

### Credit limits

The next issue came with the credits. We were generously granted $10,000 Digital Ocean credits in February through Stripe Atlas, and so they became our primary cloud provider.

Digital Ocean have another (more generous) credits package for YC companies. Unfortunately when we applied for this we were told we weren't eligible because it was a "Partner switch" from Stripe to YC. This was frustrating because a "Partner switch" is completely arbitrary to us as a customer. 

Also we had conveniently just run out of credits. We don’t expect cloud providers to fund our inefficiencies, but we needed time to optimize our infrastructure after our surprise launch. We decided to migrate away from Digital Ocean. 

## Going Forward: AWS t3a

In the past 3 weeks we have migrated 1800 servers over to AWS. 

The AWS team at YC were super helpful, suggesting how we could run our VMs more efficiently using their new `t3a` instances. We're already starting to see massive improvements, with database startup times almost halved from ~90s to ~50s. From our research, this is the fastest Postgres setup in the market.

We will release a detailed write-up on these instances in the next few weeks. Sign up to our newsletter if you want to be notified when we release the post.