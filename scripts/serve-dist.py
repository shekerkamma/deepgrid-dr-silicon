"""Threaded static server for the verification gate.

`python3 -m http.server` is single-threaded. A browser opens several connections per page,
and once the home route started dynamically importing the scroll engine, one chunk request
sat pending forever while the server was busy: Playwright's `networkidle` never fired and the
gate failed on a page that was fine. curl fetched the same chunk in 2 ms.
"""
import sys, os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
root = sys.argv[2] if len(sys.argv) > 2 else os.getcwd()
handler = partial(SimpleHTTPRequestHandler, directory=root)
ThreadingHTTPServer.daemon_threads = True
ThreadingHTTPServer(('127.0.0.1', port), handler).serve_forever()
