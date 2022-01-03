#!/bin/bash

bindir="$(dirname "$(readlink -fm "$0")")"
cd "${bindir}"

cp "${bindir}/node_modules/mvp.css/mvp.css"  "${bindir}/dist/mvp.css"
elm make frontend/Main.elm --optimize --output=dist/elm.js
