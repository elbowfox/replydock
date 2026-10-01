#!/usr/bin/env python3
"""Generate ReplyDock Pro license keys.

The secret must match LICENSE_SECRET in replydock/license.js before you ship.
Sell the printed keys on Gumroad or Lemon Squeezy. No server required.
"""
import argparse
import hashlib
import hmac
import secrets

SECRET = b"replydock-change-this-secret-before-publish"


def make_key() -> str:
    body = secrets.token_hex(6)  # 12 hex chars
    sig = hmac.new(SECRET, body.encode(), hashlib.sha256).hexdigest()[:8]
    compact = body + sig
    return f"RD-{compact[0:4]}-{compact[4:8]}-{compact[8:12]}-{compact[12:20]}".upper()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("-n", type=int, default=25, help="how many keys")
    parser.add_argument("-o", default="license-keys.txt")
    args = parser.parse_args()
    keys = [make_key() for _ in range(args.n)]
    with open(args.o, "w", encoding="utf-8") as f:
        f.write("\n".join(keys) + "\n")
    print(f"Wrote {len(keys)} keys to {args.o}")
    print(keys[0])


if __name__ == "__main__":
    main()
