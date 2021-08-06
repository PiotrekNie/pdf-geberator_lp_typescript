#!/bin/bash

find . -type d -exec chmod 755 {} -R \;
find . -type f -exec chmod 644 {} -R \;
