#!/bin/bash

REMOTE="recycle.cs.washington.edu:/homes/gws/jcchuang/www/gib/"

echo "rsync -ravz public_html/* $REMOTE"
rsync -ravz public_html/* $REMOTE
