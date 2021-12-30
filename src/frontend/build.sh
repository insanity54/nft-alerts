#!/bin/bash

bindir="$(dirname "$(readlink -fm "$0")")"

cp "${bindir}/../../node_modules/mvp.css/mvp.css"  "${bindir}/../../dist/mvp.css"
elm make src/frontend/Main.elm --optimize --output=dist/elm.js