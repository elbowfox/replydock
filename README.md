# ReplyDock

Canned replies for Chrome. Free for 10 templates. Pro is a one-time license key, checked on the device. No backend.

## Load it locally

1. Open `chrome://extensions`
2. Enable Developer mode
3. Load unpacked → select the `replydock` folder
4. Pin ReplyDock. Click a text field, open the popup, Insert.

Chrome Web Store pages and `chrome://` URLs block content scripts. Test on Gmail or any normal site.

## Before you charge money

1. Change `LICENSE_SECRET` in `replydock/license.js` and `SECRET` in `tools/generate_licenses.py` to the same long random string.
2. Run `python3 tools/generate_licenses.py -n 50 -o license-keys.txt`
3. Create a Gumroad or Lemon Squeezy product at $29. Deliver the key in the receipt email. One key per buyer is enough for this version; keys are not device-locked.
4. Put the product URL in `landing/index.html`.
5. Host `landing/index.html` (GitHub Pages, Cloudflare Pages, Netlify). The Chrome Web Store privacy field needs a public URL to the privacy section: `https://your-domain/#privacy`
6. Zip the `replydock` folder contents (manifest at the zip root) and upload to the [Chrome Web Store developer dashboard](https://chrome.google.com/webstore/devconsole). The one-time registration fee is $5.

## What not to expect

This can take money the day the listing and checkout are live. It will not make significant revenue by itself. The distribution work is the product: a short demo video, a post in support/founder communities, and a Gumroad page with the before/after. Review on the Chrome Web Store often takes a few days.

License keys can be copied. That is an acceptable trade for having no server. If copying becomes a problem, move verification to a Lemon Squeezy license API.

## Automation

An agent can keep this running without new product code:

- Generate a fresh key batch when stock is low
- Paste keys into the Gumroad file or webhook email
- Refresh the store screenshots after UI changes
- Reply to support with the install and license steps

It cannot pass store review, own the payout account, or buy ads for you.
