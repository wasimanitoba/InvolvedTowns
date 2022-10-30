# About

**What is InvolvedTowns**?

A link-sharing discussion forum with local-first personal note libraries for research groups.

# Technologies

This project uses:

- Ruby on Rails - web development framework
- Thredded - Rails forum engine
- PostgreSQL - database for the forum and Rails
- PouchDB - local IndexedDB database with syncing capabilities

A component of this project is StackBiblio, a suite of tools for building a personal note library. StackBiblio uses the following:
- React - front-end library
- CouchDB - Cluster database for syncing across machines

# Setup 

In order to deploy this app, there are three main steps:

- 1) Install OS dependencies (git, npm, postgres) and set up permissions (create database, set database user and password)
- 2) Clone the repo, `npm install`
- 3) [Install and configure CouchDB](https://docs.couchdb.org/en/latest/install/index.html)
