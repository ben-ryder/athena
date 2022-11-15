# Encryption Methodology

## Basics
- A user must have an `encryption key` for use in client-side encryption. This must be set up before they
can use the application.
- A user provides an `encryption password` which is put through a key derivation function (KDF) to generate a `master key`.
- The `encryption key` is generated once by the application and is then encrypted/decrypted using that derived `master key`.
- The `encryption password` is never stored.
- The `encryption key` and `master key` are only ever stored in memory.
- An `encryption secret` is saved locally and to the user's profile (if they have an account) which is the `encryption key`
encrypted using the `master key`. This means that to decrypt and view content a user must know the `encryption password`.

## Managing Accounts
Athena can be used with or without an account, which means that there are a number of different states the
application may be in when a user logs in.  
Here's how the application handles all of these:


- No local profile & no local changes, no server profile & no server changes
  - Go to initial setup
- No local profile & no local changes, server profile & no server changes
- No local profile & no local changes, server profile & server changes
  - fetch server profile, make user enter password
- No local profile & no local changes, no server profile & server changes
  - unrecoverable state, go to reset page

- No local profile & local changes, no server profile & no server changes
- No local profile & local changes, server profile & no server changes
- No local profile & local changes, no server profile & server changes
- No local profile & local changes, server profile & server changes
  - unrecoverable state, go to reset page

- local profile & no local changes, no server profile & no server changes
  - push local profile to server, continue on
- local profile & no local changes, server profile & no server changes
  - overwrite local profile with server profile, continue on
- local profile & no local changes, no server profile & server changes
 - unrecoverable state, go to reset page
- local profile & no local changes, server profile & server changes
  - overwrite local profile with server profile, continue on

- local profile & local changes, no server profile & no server changes
  - push local profile to server, continue on
- local profile & local changes, server profile & no server changes
- local profile & local changes, no server profile & server changes
- local profile & local changes, server profile & server changes
  - unrecoverable state, go to reset page
